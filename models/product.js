const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coverImg: String,
  descriptions: String,
  price: Number,
  quantity: Number,
  productType: {
    type: mongoose.SchemaTypes.ObjectId,
  },
  content: String,
}, {
  timestamps: true
})

const Product = mongoose.model('product', productSchema);

module.exports = Product;