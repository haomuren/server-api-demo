const mongoose = require('mongoose');
const User = require('./user');
const ProductType = require('./product_type');
const Product = require('./product');

mongoose.connect('mongodb://localhost:27017/dog-shop', {useNewUrlParser: true});

module.exports = {
  User,
  ProductType,
  Product
}