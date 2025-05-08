import { Request, Response } from 'express';
import publicacaoService from '../services/publicacao.service';

class PublicacaoController {
  /**
   * Busca todos os artigos aprovados
   * @param req Requisição
   * @param res Resposta
   */
  async getAllArtigosAprovados(req: Request, res: Response): Promise<Response> {
    try {
      const { evento, areaTematica, autor, palavraChave } = req.query;
      const artigos = await publicacaoService.getAllArtigosAprovados({
        evento: evento ? Number(evento) : undefined,
        areaTematica: areaTematica ? String(areaTematica) : undefined,
        autor: autor ? Number(autor) : undefined,
        palavraChave: palavraChave ? String(palavraChave) : undefined,
      });

      return res.status(200).json(artigos);
    } catch (error) {
      if (error instanceof Error) {
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca um artigo aprovado pelo ID
   * @param req Requisição
   * @param res Resposta
   */
  async getArtigoAprovadoById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const artigo = await publicacaoService.getArtigoAprovadoById(Number(id));

      return res.status(200).json(artigo);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Artigo não encontrado ou não está aprovado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }
}

export default new PublicacaoController();