// const boom = require('@hapi/boom');

const { Boom } = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class OrderService {
  constructor() {}
  async create(data) {
    console.log('user data', data);

    const customer = await models.Customer.findOne({
      where: {
        '$user.id$': data.userId,
      },
      include: ['user'],
    });

    console.log('Customer Data', customer);
    data.customerId = customer.id;
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
  }

  async find() {
    const order = await models.Order.findAll({
      include: [
        // {
        //   association: 'customer',
        //   include: ['user'],
        // },
        'items',
      ],
    });
    return order;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    return order;
  }

  async findByUser(userId) {
    const order = await models.Order.findAll({
      where: {
        // Sequilize form to filter all the orders by customer on user
        '$customer.user.id$': userId,
      },
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
        'items',
      ],
    });
    return order;
  }

  async update(id, changes) {
    return {
      id,
      changes,
    };
  }

  async delete(id) {
    return { id };
  }
}

module.exports = OrderService;
