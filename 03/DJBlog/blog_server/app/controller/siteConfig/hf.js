'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller web端页头页脚配置信息
 */
class HfController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      header: {
        type: 'object',
        rule: {
          logo: {
            type: 'string',
            required: false,
          },
          title: {
            type: 'string',
            required: false,
            max: 20,
          },
          openSearch: {
            type: 'boolean',
            default: true,
          },
          login: {
            type: 'boolean',
            default: false,
          },
          register: {
            type: 'boolean',
            default: false,
          },
        },
      },
      footer: {
        type: 'object',
        rule: {
          copyright: {
            type: 'string',
            min: 1,
            max: 200,
          },
          extra: {
            type: 'string',
            min: 1,
            max: 200,
          },
        },
      },
    };
  }
  /**
   * @summary 获取页头页脚配置
   * @description 获取页头页脚配置
   * @router get /web/v1/config/hf
   */
  async index() {
    const { ctx, service } = this;
    const res = await service.siteConfig.hf.index();
    ctx.helper.success({ ctx, res });
  }

  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    // console.log('data', data);
    ctx.validate(this.createRule, data);
    const res = await service.siteConfig.hf.create(data);
    ctx.helper.success({ ctx, res });
  }

  async update() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const id = ctx.params.id;
    ctx.validate(this.createRule, data);
    const res = await service.siteConfig.hf.update({
      id,
      ...data,
    });
    ctx.helper.success({ ctx, res });
  }

}

module.exports = HfController;
