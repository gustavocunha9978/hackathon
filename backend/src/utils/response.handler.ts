import { Response } from 'express';

/**
 * Classe para padronização de respostas da API
 */
export class ResponseHandler {
  /**
   * Envia uma resposta de sucesso
   * @param res Objeto de resposta do Express
   * @param data Dados a serem enviados
   * @param statusCode Código de status HTTP (padrão: 200)
   * @returns Resposta formatada
   */
  static success(res: Response, data: any, statusCode: number = 200): Response {
    return res.status(statusCode).json({
      success: true,
      data,
    });
  }

  /**
   * Envia uma resposta de sucesso com mensagem
   * @param res Objeto de resposta do Express
   * @param message Mensagem de sucesso
   * @param statusCode Código de status HTTP (padrão: 200)
   * @returns Resposta formatada
   */
  static successMessage(
    res: Response,
    message: string,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
    });
  }

  /**
   * Envia uma resposta de sucesso com dados e mensagem
   * @param res Objeto de resposta do Express
   * @param data Dados a serem enviados
   * @param message Mensagem de sucesso
   * @param statusCode Código de status HTTP (padrão: 200)
   * @returns Resposta formatada
   */
  static successWithMessage(
    res: Response,
    data: any,
    message: string,
    statusCode: number = 200
  ): Response {
    return res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  }

  /**
   * Envia uma resposta de erro
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @param statusCode Código de status HTTP (padrão: 500)
   * @returns Resposta formatada
   */
  static error(
    res: Response,
    message: string,
    statusCode: number = 500
  ): Response {
    return res.status(statusCode).json({
      success: false,
      error: true,
      message,
    });
  }

  /**
   * Envia uma resposta de erro com detalhes
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @param details Detalhes do erro
   * @param statusCode Código de status HTTP (padrão: 500)
   * @returns Resposta formatada
   */
  static errorWithDetails(
    res: Response,
    message: string,
    details: any,
    statusCode: number = 500
  ): Response {
    return res.status(statusCode).json({
      success: false,
      error: true,
      message,
      details,
    });
  }

  /**
   * Envia uma resposta de validação inválida
   * @param res Objeto de resposta do Express
   * @param errors Erros de validação
   * @returns Resposta formatada
   */
  static validationError(res: Response, errors: any[]): Response {
    return res.status(400).json({
      success: false,
      error: true,
      message: 'Erro de validação',
      errors,
    });
  }

  /**
   * Envia uma resposta de recurso não encontrado
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @returns Resposta formatada
   */
  static notFound(res: Response, message: string): Response {
    return res.status(404).json({
      success: false,
      error: true,
      message,
    });
  }

  /**
   * Envia uma resposta de acesso não autorizado
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @returns Resposta formatada
   */
  static unauthorized(res: Response, message: string): Response {
    return res.status(401).json({
      success: false,
      error: true,
      message,
    });
  }

  /**
   * Envia uma resposta de acesso proibido
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @returns Resposta formatada
   */
  static forbidden(res: Response, message: string): Response {
    return res.status(403).json({
      success: false,
      error: true,
      message,
    });
  }

  /**
   * Envia uma resposta de conflito
   * @param res Objeto de resposta do Express
   * @param message Mensagem de erro
   * @returns Resposta formatada
   */
  static conflict(res: Response, message: string): Response {
    return res.status(409).json({
      success: false,
      error: true,
      message,
    });
  }

  /**
   * Envia uma resposta personalizada
   * @param res Objeto de resposta do Express
   * @param data Dados a serem enviados
   * @param statusCode Código de status HTTP
   * @returns Resposta formatada
   */
  static custom(res: Response, data: any, statusCode: number): Response {
    return res.status(statusCode).json(data);
  }
}