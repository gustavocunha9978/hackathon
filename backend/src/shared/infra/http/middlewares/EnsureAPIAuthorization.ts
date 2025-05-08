import { Request, Response, NextFunction } from 'express';
import { createHash } from 'crypto';
import AppError from '@shared/errors/AppErrors';

/**
 * Criado um Token JWT com secret, criptografado o token com md5.
 * Esse md5 deve ser enviado pela LP
 *
 * No código é feito a comparação se o token envido é válido (refaz a criptografia e verifica se md5 é igual)
 */

export default function EnsureAPIAuthorization(
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    // eslint-disable-next-line @typescript-eslint/no-throw-literal
    throw new AppError('Token is missing', 401);
  }

  const encriptedToken = createHash('md5')
    .update(
      // pode ser modificado para qualquer string
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxOTY1ODc0IiwibmFtZSI6IkJQSyBFRFUiLCJpYXQiOjE2NjE4NzgwNTU0OTZ9.PWu7e4EOcbwwQW_bltHpjRsrdQGXMt_trW4e9Rost9Q',
    )
    .digest('hex');

  // Tira o Bearer
  const [, token] = authHeader.split(' ');

  if (encriptedToken === token) {
    return next();
  }

  throw new AppError('Unauthorized Access', 401);

  // try {
  //   const decoded = verify(token, '#Bio@2022GD1#');

  //   const { email, name, sector } = decoded as IPayload;

  //   if (sector === 'education' || sector === 'Directors') {
  //     request.user = {
  //       email: 'homologa.edu@biopark.com.br',
  //       name: 'Homologa Educação',
  //       sector: 'education',
  //     };
  //     return next();
  //   }
  //   throw new AppError('Unauthorized Access', 401);
  // } catch (err) {
  //   throw new AppError('Unauthorized Access', 401);
  // }
  // return next();
}
