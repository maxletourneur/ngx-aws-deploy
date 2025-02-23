# Disclaimer: This is a temporary fork from [@jefiozie/ngx-aws-deploy](https://www.npmjs.com/package/@jefiozie/ngx-aws-deploy) <-- use this instead

# This temporary fork adds the new feature waiting to be merged in the original repo, linked below and described at step #7 of the Quick Start documentation below.

# [add a globFileUploadParamsList option to set properties on uploaded files](https://github.com/Jefiozie/ngx-aws-deploy/pull/410)

# NGX-AWS-DEPLOY

☁️🚀 Deploy your Angular app to Amazon S3 directly from the Angular CLI 🚀☁️

<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->

[![All Contributors](https://img.shields.io/badge/all_contributors-8-orange.svg?style=flat-square)](#contributors-)

<!-- ALL-CONTRIBUTORS-BADGE:END -->

![CI](https://github.com/Jefiozie/ngx-aws-deploy/workflows/Publish/badge.svg)
![npm](https://img.shields.io/npm/dw/@jefiozie/ngx-aws-deploy)
![npm (scoped)](https://img.shields.io/npm/v/@jefiozie/ngx-aws-deploy)
![GitHub issues](https://img.shields.io/github/issues/jefiozie/ngx-aws-deploy)
<a href="https://twitter.com/jefiozie">
<img src="https://img.shields.io/badge/say-thanks-ff69b4.svg"/>
</a>
<a href="https://twitter.com/jefiozie">  
 <img alt="Twitter Follow" src="https://img.shields.io/twitter/follow/jefiozie?style=social">
</a>

<p align="center">
  <img src="https://github.com/Jefiozie/ngx-aws-deploy/blob/main/ngx-aws-deploy_logo.png?raw=true" alt="ngx-aws-deploy" />
</p>

## Quick Start

1. Install the latest version of Angular cli

   ```sh
   yarn global add @angular/cli
   ```

2. Create a new Angular project
   ```sh
   ng new hello-world --defaults
   cd hello-world
   ```
3. Add `@jefiozie/ngx-aws-deploy` to your project

   ```sh
   ng add @jefiozie/ngx-aws-deploy
   ```

4. After these steps your `angular.json` is updated with a new builder:

   ```json
   "deploy": {
      "builder": "@jefiozie/ngx-aws-deploy:deploy",
      "options": {}
   }
   ```

5. Due to security risk we have made the decision to never add any options to the `angular.json`. You should set the environments variable during the `ng deploy` command. Below is an example on how you could do this.

```bash
npx cross-env NG_DEPLOY_AWS_ACCESS_KEY_ID=1234 NG_DEPLOY_AWS_SECRET_ACCESS_KEY=321ACCESS NG_DEPLOY_AWS_BUCKET=mys3bucket NG_DEPLOY_AWS_REGION=eu-1-region NG_DEPLOY_AWS_SUB_FOLDER=path/on/bucker ng deploy
```

6. To trigger an optional invalidation of the files in an AWS CloudFront distribution, add these parameters to the above command line:

```
npx cross-env ... NG_DEPLOY_AWS_CF_DISTRIBUTION_ID=1234 ... ng deploy
```

7. To apply properties on uploaded files, use the `NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST` variable or the target option `globFileUploadParamsList` as shown below.  
   We use an array of objects to represent the different configurations.  
   Each config object needs a `glob` property to define on which files the params will be set.  
   Other properties on the config object are the params to apply.
   For informations about the possible params (ACL, Bucket, CacheControl, etc), checkout the documentation of the `s3.upload` method (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property)

```json
"deploy": {
  "builder": "@jefiozie/ngx-aws-deploy:deploy",
  "options": {
    "globFileUploadParamsList": [
      {
        "glob": "*",
        "ACL": "public-read",
        "CacheControl": "max-age=3600"
      },
      {
        "glob": "*.html",
        "CacheControl": "max-age=300"
      }
    ]
  }
},
```

The order of the config objects matters, the one that comes last is the one that will be used, as shown above:

- CacheControl is set for all files but it's overidden by the next config object only for html files. Convenient for declaring exceptions and not repeat global settings.

To set this using the environment variable `NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST`, simply stringify the config object to JSON with `JSON.stringify`.

```bash
npx cross-env ... NG_DEPLOY_AWS_GLOB_FILE_UPLOAD_PARAMS_LIST='[{"glob":"*","ACL":"public-read","CacheControl":"max-age=3600"},{"glob":"*.html","CacheControl":"max-age=300"}]' ... ng deploy
```

8. Run `ng deploy` to deploy your application to Amazon S3.

🚀**_Happy deploying!_** 🚀

## Security 🔑

Keep in mind that **with the default config, everybody that has access to the angular.json will have your aws secret**.
If you want more security, you can also use environment variable with `NG_DEPLOY_AWS_ACCESS_KEY_ID`, `NG_DEPLOY_AWS_SECRET_ACCESS_KEY`, `NG_DEPLOY_AWS_BUCKET` and `NG_DEPLOY_AWS_REGION`.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
The builder is located in the `libs\ngx-aws-deploy`folder.
The sample app is located in the `apps\demo-app` folder.
Please make sure to update tests as appropriate.

## License

[MIT](./LICENSE)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://jefiozie.github.io"><img src="https://avatars0.githubusercontent.com/u/17835373?v=4" width="100px;" alt=""/><br /><sub><b>Jeffrey Bosch</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=Jefiozie" title="Code">💻</a> <a href="#content-Jefiozie" title="Content">🖋</a> <a href="https://github.com/Jefiozie/ngx-aws-deploy/pulls?q=is%3Apr+reviewed-by%3AJefiozie" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://www.santoshyadav.dev"><img src="https://avatars3.githubusercontent.com/u/11923975?v=4" width="100px;" alt=""/><br /><sub><b>Santosh Yadav</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=santoshyadav198613" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/beaussart"><img src="https://avatars0.githubusercontent.com/u/7281023?v=4" width="100px;" alt=""/><br /><sub><b>Nicolas Beaussart</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=beaussart" title="Code">💻</a></td>
    <td align="center"><a href="https://stefannieuwenhuis.github.io/"><img src="https://avatars1.githubusercontent.com/u/12104589?v=4" width="100px;" alt=""/><br /><sub><b>Stefan Nieuwenhuis</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=StefanNieuwenhuis" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/zack9433"><img src="https://avatars3.githubusercontent.com/u/1610642?v=4" width="100px;" alt=""/><br /><sub><b>Zack Yang</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=zack9433" title="Code">💻</a></td>
    <td align="center"><a href="https://djhouseknecht.github.io/"><img src="https://avatars2.githubusercontent.com/u/32391370?v=4" width="100px;" alt=""/><br /><sub><b>David Houseknecht</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=djhouseknecht" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/brianfromoregon"><img src="https://avatars2.githubusercontent.com/u/1198163?v=4" width="100px;" alt=""/><br /><sub><b>Brian Harris</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=brianfromoregon" title="Documentation">📖</a></td>
  </tr>
  <tr>
    <td align="center"><a href="http://www.mv-web.net"><img src="https://avatars0.githubusercontent.com/u/4363766?v=4" width="100px;" alt=""/><br /><sub><b>Michael Vogl</b></sub></a><br /><a href="https://github.com/Jefiozie/ngx-aws-deploy/commits?author=cubasepp" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
