/* eslint valid-jsdoc: "off" */

'use strict';

// 导入userConfig
const userConfig = require('./config.user');

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  config.userName = 'admin';
  config.baseRouter = '/api/v1';
  config.baseWebRouter = '/web/v1';
  config.qiniu = userConfig.qiniu;


  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1681261932544_2249';
  // add your middleware config here
  config.middleware = [ 'errorhandler' ];
  config.security = {
    csrf: false,
  };
  config.mongoose = {
    url: userConfig.mongoDbUrl,
    options: {},
  };
  config.jwt = {
    secret: userConfig.jwtSecret,
  };

  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: '接口文档',
      description: '博客后端接口文档',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json', 'multipart/form-data' ],
    produces: [ 'application/json', 'multipart/form-data' ],
    securityDefinitions: { // 配置接口安全授权方式
      Jwt: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
    },
    enableSecurity: true,
    // enableValidate: true,
    routerMap: true,
    enable: true,
  };

  config.onerror = {
    all(err, ctx) {
      console.log(err);
      ctx.body = 'error';
      ctx.status = 500;
    },
    html(err, ctx) {
      ctx.body = '<h3>error</h3>';
      ctx.status = 500;
    },
    json(err, ctx) {
      ctx.body = { message: 'error' };
      ctx.status = 500;
    },
  };

  return {
    ...config,
  };
};
