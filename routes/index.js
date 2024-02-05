const express = require('express');

const productsRouter = require('./products.router');
const categoriesRouter = require('./categories.router');
const usersRouter = require('./users.router');
const orderRouter = require('./orders.router');
const customersRouter = require('./customer.route');
const authRouter = require('./auth.router');
const profileRouter = require('./profile.router');

function routerApi(app) {
  const router = express.Router();
  app.use('/api/v1', router);
  router.use(
    '/products',
    // #swagger.tags = ['Products']
    productsRouter
  );
  router.use(
    '/categories',
    // #swagger.tags = ['Categories']
    categoriesRouter
  );
  router.use(
    '/users',
    // #swagger.tags = ['Users']
    usersRouter
  );
  router.use(
    '/orders',
    // #swagger.tags = ['Orders']
    orderRouter
  );
  router.use(
    '/customers',
    // #swagger.tags = ['Customers']
    customersRouter
  );
  router.use(
    '/auth',
    // #swagger.tags = ['Customers']
    authRouter
  );
  router.use(
    '/profile',
    // #swagger.tags = ['Customers']
    profileRouter
  );
}

module.exports = routerApi;
