import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import eventoService from '../services/evento.service';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';
import { ResponseHandler } from '../utils/response.handler';

class EventoController {
  /**
   * Cria um novo evento
   * @param req Requisição
   * @param res Resposta
   */
  async createEvento(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
      }

      // Se houver arquivo de banner, salva o caminho
      let bannerPath = '';
      if (req.file) {
        bannerPath = `/uploads/${req.file.filename}`;
      } else if (req.body.banner) {
        bannerPath = req.body.banner;
      } else {
        return ResponseHandler.error(res, 'Banner é obrigatório', 400);
      }

      // Cria o evento
      const { nome, descricao, idinstituicao, dataInicio, dataFim, idtipoAvalicao } = req.body;
      const evento = await eventoService.createEvento({
        nome,
        banner: bannerPath,
        descricao,
        idinstituicao,
        dataInicio,
        dataFim,
        idtipoAvalicao: idtipoAvalicao ? JSON.parse(idtipoAvalicao) : undefined,
      });

      // return ResponseHandler.success(res, evento, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'A data de início deve ser anterior à data de fim') {
          return ResponseHandler.error(res, error.message, 400);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Adiciona avaliadores a um evento
   * @param req Requisição
   * @param res Resposta
   */
  async addAvaliadoresEvento(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
      }

      const { id } = req.params;
      const { avaliadoresIds } = req.body;
      
      // Adiciona os avaliadores ao evento
      const evento = await eventoService.addAvaliadoresEvento(Number(id), {
        avaliadoresIds,
      });

      return ResponseHandler.successWithMessage(
        res, 
        evento, 
        'Avaliadores adicionados com sucesso',
        200
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        if (error.message.includes('não encontrado') || error.message.includes('não tem permissão')) {
          return ResponseHandler.error(res, error.message, 400);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Remove avaliadores de um evento
   * @param req Requisição
   * @param res Resposta
   */
  async removeAvaliadoresEvento(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
      }

      const { id } = req.params;
      const { avaliadoresIds } = req.body;
      
      // Remove os avaliadores do evento
      const evento = await eventoService.removeAvaliadoresEvento(Number(id), {
        avaliadoresIds,
      });

      return ResponseHandler.successWithMessage(
        res, 
        evento, 
        'Avaliadores removidos com sucesso',
        200
      );
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Obtém os avaliadores de um evento
   * @param req Requisição
   * @param res Resposta
   */
  async getAvaliadoresEvento(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const avaliadores = await eventoService.getAvaliadoresEvento(Number(id));

      return ResponseHandler.success(res, avaliadores);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Busca um evento pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async getEventoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const evento = await eventoService.getEventoById(Number(id));

      return ResponseHandler.success(res, evento);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Busca todos os eventos
   * @param req Requisição
   * @param res Resposta
   */
  async getAllEventos(req: Request, res: Response): Promise<Response> {
    try {
      const { status, dataInicio, dataFim } = req.query;
      const eventos = await eventoService.getAllEventos({
        status: status ? Number(status) : undefined,
        dataInicio: dataInicio ? String(dataInicio) : undefined,
        dataFim: dataFim ? String(dataFim) : undefined,
      });

      return ResponseHandler.success(res, eventos);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Atualiza um evento
   * @param req Requisição
   * @param res Resposta
   */
  async updateEvento(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
      }

      const { id } = req.params;
      
      // Se houver arquivo de banner, salva o caminho
      let bannerPath;
      if (req.file) {
        bannerPath = `/uploads/${req.file.filename}`;
        
        // Busca o evento para remover o banner antigo
        const eventoAntigo = await eventoService.getEventoById(Number(id));
        
        // Remove o banner antigo
        if (eventoAntigo.banner && eventoAntigo.banner.startsWith('/uploads/')) {
          const bannerAntigoPath = path.join(__dirname, '../../', config.uploadDir, path.basename(eventoAntigo.banner));
          
          if (fs.existsSync(bannerAntigoPath)) {
            fs.unlinkSync(bannerAntigoPath);
          }
        }
      } else if (req.body.banner) {
        bannerPath = req.body.banner;
      }

      // Atualiza o evento
      const { nome, descricao, dataInicio, dataFim, idtipoAvalicao } = req.body;
      const evento = await eventoService.updateEvento(Number(id), {
        nome,
        banner: bannerPath,
        descricao,
        dataInicio,
        dataFim,
        idtipoAvalicao: idtipoAvalicao ? JSON.parse(idtipoAvalicao) : undefined,
      });

      return ResponseHandler.success(res, evento);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        if (error.message === 'A data de início deve ser anterior à data de fim') {
          return ResponseHandler.error(res, error.message, 400);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Exclui um evento
   * @param req Requisição
   * @param res Resposta
   */
  async deleteEvento(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Busca o evento para remover o banner
      const evento = await eventoService.getEventoById(Number(id));
      
      // Remove o banner
      if (evento.banner && evento.banner.startsWith('/uploads/')) {
        const bannerPath = path.join(__dirname, '../../', config.uploadDir, path.basename(evento.banner));
        
        if (fs.existsSync(bannerPath)) {
          fs.unlinkSync(bannerPath);
        }
      }
      
      await eventoService.deleteEvento(Number(id));

      return ResponseHandler.successMessage(res, 'Evento excluído com sucesso');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Cria um checklist para um evento
   * @param req Requisição
   * @param res Resposta
   */
  async createChecklist(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseHandler.validationError(res, errors.array());
      }

      const { id } = req.params;
      const { perguntas } = req.body;
      const checklist = await eventoService.createChecklist(Number(id), perguntas);

      return ResponseHandler.success(res, checklist, 201);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return ResponseHandler.notFound(res, error.message);
        }
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }

  /**
   * Busca todos os status de evento
   * @param req Requisição
   * @param res Resposta
   */
  /*
  async getAllStatusEvento(req: Request, res: Response): Promise<Response> {
    try {
      const statusEventos = await eventoService.getAllStatusEvento();
      return ResponseHandler.success(res, statusEventos);
    } catch (error) {
      if (error instanceof Error) {
        return ResponseHandler.error(res, error.message);
      }
      return ResponseHandler.error(res, 'Erro interno do servidor');
    }
  }
    */
}

export default new EventoController();