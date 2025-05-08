import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import checklistService from '../services/checklist.service';

class ChecklistController {
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

      const { eventoId } = req.params;
      const { perguntas } = req.body;
      
      // Cria o checklist
      const checklist = await checklistService.createChecklist({
        eventoId: Number(eventoId),
        perguntas,
      });

      return res.status(201).json(checklist);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Evento não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'Este evento já possui um checklist') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca um checklist pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async getChecklistById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const checklist = await checklistService.getChecklistById(Number(id));

      return res.status(200).json(checklist);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Checklist não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca um checklist pelo ID do evento
   * @param req Requisição
   * @param res Resposta
   */
  async getChecklistByEventoId(req: Request, res: Response): Promise<Response> {
    try {
      const { eventoId } = req.params;
      const checklist = await checklistService.getChecklistByEventoId(Number(eventoId));

      return res.status(200).json(checklist);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Checklist não encontrado para este evento') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Atualiza um checklist
   * @param req Requisição
   * @param res Resposta
   */
  async updateChecklist(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params;
      const { perguntas } = req.body;
      
      // Atualiza o checklist
      const checklist = await checklistService.updateChecklist(Number(id), {
        perguntas,
      });

      return res.status(200).json(checklist);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Checklist não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Adiciona uma pergunta ao checklist
   * @param req Requisição
   * @param res Resposta
   */
  async addPergunta(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { checklistId } = req.params;
      const { descricao } = req.body;
      
      // Adiciona a pergunta
      const pergunta = await checklistService.addPergunta({
        checklistId: Number(checklistId),
        descricao,
      });

      return res.status(201).json(pergunta);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Checklist não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Atualiza uma pergunta
   * @param req Requisição
   * @param res Resposta
   */
  async updatePergunta(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { perguntaId } = req.params;
      const { descricao } = req.body;
      
      // Atualiza a pergunta
      const pergunta = await checklistService.updatePergunta(Number(perguntaId), {
        descricao,
      });

      return res.status(200).json(pergunta);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Pergunta não encontrada') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Exclui uma pergunta
   * @param req Requisição
   * @param res Resposta
   */
  async deletePergunta(req: Request, res: Response): Promise<Response> {
    try {
      const { perguntaId } = req.params;
      
      // Exclui a pergunta
      await checklistService.deletePergunta(Number(perguntaId));

      return res.status(200).json({ success: true, message: 'Pergunta excluída com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Pergunta não encontrada') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'Esta pergunta não pode ser excluída pois está sendo usada em um artigo') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Exclui um checklist
   * @param req Requisição
   * @param res Resposta
   */
  async deleteChecklist(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      
      // Exclui o checklist
      await checklistService.deleteChecklist(Number(id));

      return res.status(200).json({ success: true, message: 'Checklist excluído com sucesso' });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Checklist não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'Este checklist não pode ser excluído pois possui perguntas que estão sendo usadas em artigos') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }
}

export default new ChecklistController();