import { Request, Response, NextFunction } from 'express';

export enum Cargo {
  COORDENADOR = 1,
  AVALIADOR = 2,
  AUTOR = 3,
}

/**
 * Middleware para verificar se o usuário possui os cargos necessários
 * @param cargosPermitidos Array de IDs de cargos permitidos
 */
export const checkCargo = (cargosPermitidos: number[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Verifica se o usuário está autenticado
    if (!req.user) {
      return res.status(401).json({ error: true, message: 'Usuário não autenticado' });
    }
    
    // Verifica se o usuário possui algum dos cargos permitidos
    const userCargos = req.user.cargos.map(cargo => cargo.idcargo);
    const hasPermission = cargosPermitidos.some(cargoId => userCargos.includes(cargoId));
    
    if (!hasPermission) {
      return res.status(403).json({ 
        error: true, 
        message: 'Usuário não possui permissão para acessar este recurso' 
      });
    }
    
    return next();
  };
};

/**
 * Middleware para verificar se o usuário é coordenador
 */
export const isCoordenador = (req: Request, res: Response, next: NextFunction) => {
  return checkCargo([Cargo.COORDENADOR])(req, res, next);
};

/**
 * Middleware para verificar se o usuário é avaliador
 */
export const isAvaliador = (req: Request, res: Response, next: NextFunction) => {
  return checkCargo([Cargo.AVALIADOR, Cargo.COORDENADOR])(req, res, next);
};

/**
 * Middleware para verificar se o usuário é autor do artigo
 */
export const isAutor = async (req: Request, res: Response, next: NextFunction) => {
  // A lógica para verificar se o usuário é autor do artigo será implementada nos serviços específicos
  // Isso geralmente requer uma consulta ao banco de dados
  return next();
};