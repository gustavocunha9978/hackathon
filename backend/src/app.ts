import express, { Application, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { config } from './config/env';
import routes from './routes';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  private middlewares(): void {
    this.app.use(cors());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Configuração para servir arquivos estáticos (uploads)
    this.app.use('/uploads', express.static(path.join(__dirname, '..', config.uploadDir)));
  }

  private routes(): void {
    this.app.use('/api', routes);
  }

  private errorHandler(): void {
    // Middleware para tratamento de erros
    this.app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
      console.error(err.stack);
      
      if (err.name === 'ValidationError') {
        return res.status(400).json({
          error: true,
          message: err.message,
        });
      }
      
      if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
          error: true,
          message: 'Acesso não autorizado',
        });
      }
      
      return res.status(500).json({
        error: true,
        message: 'Erro interno do servidor',
      });
    });
  }
}

export default new App().app;