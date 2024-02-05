const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Ventas',
    description: 'Servicion de ventas',
  },
  host: 'localhost:3000',
};

const outputFile = './swagger-output.json';
const routes = ['../routes/index.js'];

swaggerAutogen(outputFile, routes, doc).then(() => {
  require('../index.js');
});
