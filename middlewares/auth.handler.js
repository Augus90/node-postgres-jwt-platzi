const boom = require('@hapi/boom');
const { config } = require('../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  // console.log('API KEY', apiKey);
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

// Para hacer la comprobacion de los roles utilizamos los clousures de la sig manera:
// Creamos la funcion que reciba un array con los roles a permitir en la autorización
function checkRole(...roles) {
  // Retorna el clousure especifico para esos roles
  return (req, res, next) => {
    console.log('User role', req.user);
    const user = req.user;
    // verifico si en role del ususario esta dentro de el array de roles perimitidos
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.unauthorized());
    }
  };
}

module.exports = { checkApiKey, checkRole };
