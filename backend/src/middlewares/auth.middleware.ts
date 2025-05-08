import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

// Estende a interface Request para incluir o usuário autenticado
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        nome: string;
        email: string;
        cargos: Array<{ idcargo: number; nome: string }>;
      };
    }
  }
}

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  // Verifica se o token está presente no header Authorization
  const authHeader = req.headers.authorization;
  
  if (!authHeader) {
    return res.status(401).json({ error: true, message: 'Token não fornecido' });
  }
  
  // Formato esperado: "Bearer <token>"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2) {
    return res.status(401).json({ error: true, message: 'Erro no formato do token' });
  }
  
  const [scheme, token] = parts;
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ error: true, message: 'Token mal formatado' });
  }
  
  // Verifica se o token é válido
  try {
    const decoded = jwt.verify(token, config.jwtSecret) as any;
    req.user = decoded.user;
    return next();
  } catch (err) {
    return res.status(401).json({ error: true, message: 'Token inválido' });
  }
};