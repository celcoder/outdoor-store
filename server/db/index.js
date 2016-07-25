'use strict';
var db = require('./_db');
module.exports = db;

var User = require('./models/user');
var Product = require('./models/product');
var Category = require('./models/category');
var Order = require('./models/order');

User.hasMany(Order);
Order.belongsTo(User);

Order.belongsToMany(Product, {through: 'ProductOrder'} );
Product.belongsToMany(Order, {through: 'ProductOrder'});

Product.belongsToMany(Category, {through: 'ProductCategory'});
Category.belongsToMany(Product, {through: 'ProductCategory'});