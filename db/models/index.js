const { User, UserSchema } = require('./user.models');
const { Customer, CustomerSchema } = require('./customer.model');
const { Category, CategorySchema } = require('./category.model');
const { Products, ProductsSchema } = require('./product.model');
const { Order, OrderSchema } = require('./orders.model');
const { OrderProduct, OrderProducSchema } = require('./order-products.model');

function setupModels(sequelize) {
  User.init(UserSchema, User.config(sequelize));
  Customer.init(CustomerSchema, Customer.config(sequelize));
  Category.init(CategorySchema, Category.config(sequelize));
  Products.init(ProductsSchema, Products.config(sequelize));
  Order.init(OrderSchema, Order.config(sequelize));
  OrderProduct.init(OrderProducSchema, OrderProduct.config(sequelize));

  // Ejecutamos todas las asiciaciones
  Customer.assocciate(sequelize.models);
  User.assocciate(sequelize.models);
  Category.assocciate(sequelize.models);
  Products.assocciate(sequelize.models);
  Order.assocciate(sequelize.models);
}

module.exports = setupModels;
