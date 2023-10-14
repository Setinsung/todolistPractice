'use strict';

const Controller = require('egg').Controller;
/**
 * @Controller web端个人简介配置信息
 */
class PersonalProfileController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.createRule = {
      nickName: {
        type: 'string',
        min: 2,
        max: 20,
      },
      desc: {
        type: 'string',
        min: 2,
        max: 100,
      },
      tags: {
        type: 'array',
        itemType: 'string',
        min: 1,
        max: 10,
      },
      friendLink: {
        type: 'array',
        itemType: 'object',
        rule: {
          link: {
            type: 'string',
          },
          icon: {
            type: 'string',
          },
        },
        min: 0,
        max: 4,
      },
      showPosition: {
        type: 'array',
        itemType: 'string',
        min: 1,
        max: 10,
      },
    };
  }
  /**
   * @summary 获取个人简介配置
   * @description 获取个人简介配置
   * @router get /web/v1/config/right/introduction
   */
  async index() {
    const { ctx, service } = this;
    const res = await service.siteConfig.right.personalProfile.index();
    ctx.helper.success({ ctx, res });
  }

  async create() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    // console.log('data', data);
    ctx.validate(this.createRule, data);
    const res = await service.siteConfig.right.personalProfile.create(data);
    ctx.helper.success({ ctx, res });
  }

  async update() {
    const { ctx, service } = this;
    const data = ctx.request.body;
    const id = ctx.params.id;
    ctx.validate(this.createRule, data);
    const res = await service.siteConfig.right.personalProfile.update({
      id,
      ...data,
    });
    ctx.helper.success({ ctx, res });
  }

}

module.exports = PersonalProfileController;
