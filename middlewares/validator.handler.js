const boom = require('@hapi/boom');

// Esto utiliza los closure de JS para crear middlewares dinamicos
function validatorHandler(schema, property) {
  // Aca devuelve el middleware configurado
  return (req, res, next) => {
    // Lee de dode viene el valor a validar
    const data = req[property];
    // abortEarly es para que debuelva todos los errores y no solo el primero
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
      next(boom.badRequest(error));
    }
    next();
  };
}

module.exports = validatorHandler;
