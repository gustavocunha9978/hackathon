/* eslint-disable @typescript-eslint/no-var-requires */
const app = require('express')();
const http = require('http');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger_output.json');

http.createServer(app).listen(3092);
console.log('Listening at:// port:%s (HTTP)', 3092);

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));
