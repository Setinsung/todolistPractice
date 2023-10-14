module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;

  const TagsSchema = new Schema(
    {
      name: {
        type: String,
        min: 2,
        max: 20,
        match: /^[\u4e00-\u9fa5A-Za-z0-9_]{2,20}$/,
      },
      createTime: {
        type: Number,
        default: 0,
      },
      updateTime: {
        type: Number,
        default: 0,
      },
      articleNum: {
        type: Number,
        default: 0,
      },
      status: {
        type: Boolean,
        default: true,
      },
    },
    {
      collection: 'tags',
      versionKey: false,
    }
  );
  // 这里的model第一个参数就是ctx.model.后面的名字
  return mongoose.model('Tags', TagsSchema);
};
