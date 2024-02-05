const { ValidationError } = require('sequelize');
const boom = require('@hapi/boom');

function handleSQLError(err, req, res, next) {
  if (err instanceof ValidationError) {
    throw boom.conflict(err.errors[0].message);
  }
  next(err);
}

module.exports = { handleSQLError };
