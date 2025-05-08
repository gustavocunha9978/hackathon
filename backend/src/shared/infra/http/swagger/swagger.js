// eslint-disable-next-line @typescript-eslint/no-var-requires
const swaggerAutogen = require('swagger-autogen')();

const outputFile = './src/shared/infra/http/swagger/swagger_output.json';
const endpointsFiles = ['./src/shared/infra/http/routes/index.ts'];

const doc = {
  info: {
    version: '1.0.0',
    title: 'GDI - ()',
    description: 'Módulo () GDI Biopark.',
  },
  host: 'localhost:(port)',
  basePath: '/api/',
  definitions: {},

  securityDefinitions: {
    Bearer: {
      type: 'apiKey',
      name: 'authorization',
      in: 'header',
    },
  },

  security: [{ Bearer: [] }],
};
swaggerAutogen(outputFile, endpointsFiles, doc);
