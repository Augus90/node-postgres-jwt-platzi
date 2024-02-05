const express = require('express');
const {
  createOrderSchema,
  getOrderSchema,
  addItemSchema,
} = require('../schemas/order.schema');
const validatorHandler = require('../middlewares/validator.handler');
const OrderService = require('../services/order.service');
const passport = require('passport');
const { checkRole } = require('../middlewares/auth.handler');

const router = express.Router();
const service = new OrderService();

router.get('/', async (req, res, next) => {
  try {
    const { id } = req.params;
    const orders = await service.find(id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
});

router.get(
  '/:id',
  validatorHandler(getOrderSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      res.json(order);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  checkRole('admin', 'customer', 'user'),
  // validatorHandler(createOrderSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = { userId: req.user.sub };
      const newOrder = await service.create(body);
      res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/add-item',
  validatorHandler(addItemSchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.addItem(body);
      res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
