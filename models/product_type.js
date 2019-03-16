const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  }  
}, {
  timestamps: true, // 在我的模型中插入时间戳.记录数据的修改和新增时间  craetedAt, updatedAt
})

const ProductType = mongoose.model('product_type', productTypeSchema);

module.exports = ProductType;