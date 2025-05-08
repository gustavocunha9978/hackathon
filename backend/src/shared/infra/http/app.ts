import 'reflect-metadata';
import '@shared/config/env';
import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import routes from '@shared/infra/http/routes';
import '@shared/infra/typeorm';
import fileUpload from 'express-fileupload';
import CelebrateErrorHandler from './middlewares/CelebrateErrorHandler';
import ErrorHandler from './middlewares/ErrorHandler';
import '../../containers';

const app = express();

app.use(cors());

app.use(express.json());

app.use(fileUpload());

app.use('/api/e', routes);

app.use(CelebrateErrorHandler);

app.use(ErrorHandler);

export default app;
