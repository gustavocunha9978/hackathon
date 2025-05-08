import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import eventoService from '../services/evento.service';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

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
        return res.status(400).json({ errors: errors.array() });
      }

      // Se houver arquivo de banner, salva o caminho
      let bannerPath = '';
      if (req.file) {
        bannerPath = `/uploads/${req.file.filename}`;
      } else if (req.body.banner) {
        bannerPath = req.body.banner;
      } else {
        return res.status(400).json({ error: true, message: 'Banner é obrigatório' });
      }

      // Cria o evento
      const { nome, descricao, dataInicio, dataFim, statusEventoId, avaliadoresIds, tipoAvaliacao } = req.body;
      const evento = await eventoService.createEvento({
        nome,
        banner: bannerPath,
        descricao,
        dataInicio,
        dataFim,
        statusEventoId: Number(statusEventoId),
        avaliadoresIds: avaliadoresIds ? JSON.parse(avaliadoresIds) : undefined,
        tipoAvaliacao: tipoAvaliacao ? JSON.parse(tipoAvaliacao) : undefined,
      });

      return res.status(201).json(evento);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'A data de início deve ser anterior à data de fim') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
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

      return res.status(200).json(evento);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
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

      return res.status(200).json(eventos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
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
        return res.status(400).json({ errors: errors.array() });
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
      const { nome, descricao, dataInicio, dataFim, statusEventoId, avaliadoresIds, tipoAvaliacao } = req.body;
      const evento = await eventoService.updateEvento(Number(id), {
        nome,
        banner: bannerPath,
        descricao,
        dataInicio,
        dataFim,
        statusEventoId: statusEventoId ? Number(statusEventoId) : undefined,
        avaliadoresIds: avaliadoresIds ? JSON.parse(avaliadoresIds) : undefined,
        tipoAvaliacao: tipoAvaliacao ? JSON.parse(tipoAvaliacao) : undefined,
      });

      return res.status(200).json(evento);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'A data de início deve ser anterior à data de fim') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
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

      return res.status(200).json({ success: true, message: 'Evento excluído com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
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
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { perguntas } = req.body;
      const checklist = await eventoService.createChecklist(Number(id), perguntas);

      return res.status(201).json(checklist);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca todos os status de evento
   * @param req Requisição
   * @param res Resposta
   */
  async getAllStatusEvento(req: Request, res: Response): Promise<Response> {
    try {
      const statusEventos = await eventoService.getAllStatusEvento();
      return res.status(200).json(statusEventos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }
}

export default new EventoController();