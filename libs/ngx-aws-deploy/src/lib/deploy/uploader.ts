import { BuilderContext } from '@angular-devkit/architect';
import * as AWS from 'aws-sdk';
import { HeadBucketRequest, PutObjectRequest } from 'aws-sdk/clients/s3';
import * as mimeTypes from 'mime-types';
import * as fs from 'fs';
import * as path from 'path';
import * as minimatch from 'minimatch';
import {
  GlobFileUploadParams,
  GlobFileUploadParamsList,
  Schema,
} from './schema';
import {
  getAccessKeyId,
  getBucket,
  getGlobFileUploadParamsList,
  getRegion,
  getSecretAccessKey,
  getSubFolder,
} from './config';

export class Uploader {
  private _context: BuilderContext;
  private _s3: AWS.S3;
  private _bucket: string;
  private _region: string;
  private _subFolder: string;
  private _builderConfig: Schema;
  private _globFileUploadParamsList: GlobFileUploadParamsList;

  constructor(context: BuilderContext, builderConfig: Schema) {
    this._context = context;
    this._builderConfig = builderConfig;
    this._bucket = getBucket(this._builderConfig);
    this._region = getRegion(this._builderConfig);
    this._subFolder = getSubFolder(this._builderConfig);
    this._globFileUploadParamsList = getGlobFileUploadParamsList(
      this._builderConfig
    );

    AWS.config.update({ region: this._region });
    this._s3 = new AWS.S3({
      apiVersion: 'latest',
      secretAccessKey: getSecretAccessKey(),
      accessKeyId: getAccessKeyId(),
    });
  }

  async upload(files: string[], filesPath: string): Promise<boolean> {
    try {
      if (!this._region || !this._bucket) {
        this._context.logger.error(
          `❌  Looks like you are missing some upload configuration (need region, bucket)`
        );
        return false;
      }

      const params: HeadBucketRequest = {
        Bucket: this._bucket,
      };

      await this._s3
        .headBucket(params)
        .promise()
        .then(() => {
          return this.uploadFiles(files, filesPath);
        })
        .catch((error) => {
          this._context.logger.error(
            `❌  The following error was found during the upload ${error}`
          );
          throw error;
        });
    } catch {
      return false;
    }
    return true;
  }

  uploadFiles(files: string[], filesPath: string) {
    return Promise.all(
      files.map(async (file) => {
        await this.uploadFile(path.join(filesPath, file), file);
      })
    );
  }

  public async uploadFile(localFilePath: string, originFilePath: string) {
    const fileName = path.basename(localFilePath);
    const globFileUploadParamsForFile = this._globFileUploadParamsList.filter(
      (params: GlobFileUploadParams) => minimatch(originFilePath, params.glob)
    );

    const mergedParamsForFile = globFileUploadParamsForFile.reduce(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      (acc, { glob, ...params }) => ({
        ...acc,
        ...params,
      }),
      {}
    );

    const body = fs.createReadStream(localFilePath);
    body.on('error', function (err) {
      console.log('File Error', err);
    });

    const params: PutObjectRequest = {
      Bucket: this._bucket,
      Key: this._subFolder
        ? `${this._subFolder}/${originFilePath}`
        : originFilePath,
      Body: body,
      ContentType: mimeTypes.lookup(fileName) || undefined,
      ...mergedParamsForFile,
    };

    await this._s3
      .upload(params)
      .promise()
      .then((file) =>
        this._context.logger.info(
          `Uploaded file "${file.Key}" to ${file.Location}`
        )
      )
      .catch((item) => {
        this._context.logger.error(`Error uploading file: ${item}`);
        throw item;
      });
  }
}
