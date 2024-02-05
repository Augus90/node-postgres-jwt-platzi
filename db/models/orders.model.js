const { Model, DataTypes, Sequelize } = require('sequelize');
const { CUSTOMER_TABLE } = require('./customer.model');

const ORDERS_TABLE = 'orders';

const OrderSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW,
  },
  customerId: {
    field: 'customer_id',
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: CUSTOMER_TABLE,
      key: 'id',
    },
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
  },
  // virtual fields don't have a representation on the database, they are created on the fly by the programming engine
  total: {
    type: DataTypes.VIRTUAL,
    get() {
      try {
        if (this.items.length > 0) {
          return this.items.reduce((total, item) => {
            return total + item.price * item.OrderProduct.amount;
          }, 0);
        }
        return 0;
      } catch (e) {
        return 0;
      }
    },
  },
};

class Order extends Model {
  static assocciate(models) {
    // assocciate the model bidirectional
    this.belongsTo(models.Customer, {
      as: 'customer',
    });
    // assocate the model many to many through the table orderProducts
    this.belongsToMany(models.Product, {
      as: 'items',
      through: models.OrderProduct,
      foreignKey: 'orderId',
      otherKey: 'productId',
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ORDERS_TABLE,
      modelName: 'Order',
      timestamps: false,
    };
  }
}

module.exports = { ORDERS_TABLE, OrderSchema, Order };
