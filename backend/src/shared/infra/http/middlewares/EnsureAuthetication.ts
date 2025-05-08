import AppError from '@shared/errors/AppErrors';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';
import jwt from '@config/token';

interface IPayload {
  id: string;
  email: string;
  name: string;
  sector: 'education' | 'Directors';
}

export default function EnsureAuthetication(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('JWT token is missing', 401);
  }

  // Tira o Bearer
  const [, token] = authHeader.split(' ');

  try {
    const decoded = verify(token, jwt.publicKey);

    const { email, name, sector, id } = decoded as IPayload;

    if (sector === 'education' || sector === 'Directors') {
      request.user = {
        email,
        name,
        sector,
        id,
      };
      return next();
    }
    throw new AppError('Unauthorized Access', 401);
  } catch (err) {
    throw new AppError('Unauthorized Access', 401);
  }
  // request.user = {
  //   email: 'homologa.edu@biopark.com.br',
  //   name: 'Homologa Educação',
  //   sector: 'education',
  //   isAdmin: true,
  // };
  return next();
}
