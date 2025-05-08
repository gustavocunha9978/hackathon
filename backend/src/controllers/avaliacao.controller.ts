import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import avaliacaoService from '../services/avaliacao.service';
import prisma from '../config/database';

class AvaliacaoController {
  /**
   * Cria uma nova avaliação
   * @param req Requisição
   * @param res Resposta
   */
  async createAvaliacao(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params; // ID da versão do artigo
      const { nota, observacao } = req.body;

      // Caminho do arquivo PDF se enviado
      let avaliacaoPdf = '';
      if (req.file) {
        avaliacaoPdf = `/uploads/${req.file.filename}`;
      }

      // Verifica se o usuário é avaliador
      const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
      const isAvaliador = userCargos.includes(2) || userCargos.includes(1); // avaliador ou coordenador

      if (!isAvaliador) {
        return res.status(403).json({
          error: true,
          message: 'Você não tem permissão para avaliar artigos',
        });
      }

      // Verifica se a versão do artigo existe e se pertence a um evento que o usuário é avaliador
      const versaoArtigo = await prisma.versaoArtigo.findUnique({
        where: { idversao_artigo: Number(id) },
        include: {
          artigo: {
            include: {
              autores: true
            }
          }
        }
      });

      if (!versaoArtigo) {
        return res.status(404).json({ error: true, message: 'Versão do artigo não encontrada' });
      }

      // Verifica se o usuário não é autor do artigo (sistema double-blind)
      const isAutor = versaoArtigo.artigo.autores.some(
        autor => autor.usuario_idusuario === req.user?.id
      );

      if (isAutor) {
        return res.status(403).json({
          error: true,
          message: 'Você não pode avaliar seus próprios artigos',
        });
      }

      // Cria a avaliação
      const avaliacao = await avaliacaoService.createAvaliacao({
        nota,
        observacao,
        avaliacaoPdf,
        usuarioId: req.user?.id as number,
        versaoArtigoId: Number(id),
      });

      return res.status(201).json(avaliacao);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Versão do artigo não encontrada') {
          return res.status(404).json({ error: true, message: error.message });
        }
        if (error.message === 'Você já avaliou esta versão do artigo') {
          return res.status(400).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Busca todas as avaliações de um artigo
   * @param req Requisição
   * @param res Resposta
   */
  async getAvaliacoesByArtigo(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params; // ID do artigo
      const avaliacoes = await avaliacaoService.getAvaliacoesByArtigo(Number(id));

      // Verifica se o usuário é autor, coordenador ou avaliador
      const artigo = await prisma.artigo.findUnique({
        where: { idartigo: Number(id) },
        include: {
          autores: true,
        },
      });

      if (!artigo) {
        return res.status(404).json({ error: true, message: 'Artigo não encontrado' });
      }

      const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
      const isAutor = artigo.autores.some(autor => autor.usuario_idusuario === req.user?.id);
      const isCoordenador = userCargos.includes(1);
      const isAvaliador = userCargos.includes(2);

      // Filtra as avaliações conforme permissões
      // Coordenador vê tudo
      // Autor vê as avaliações, mas sem identificação dos avaliadores
      // Avaliador vê suas próprias avaliações e sabe que são suas
      let avaliacoesPermitidas = avaliacoes;

      if (isAutor && !isCoordenador) {
        // Autor vê as avaliações, mas sem identificação dos avaliadores (double-blind)
        avaliacoesPermitidas = avaliacoes.map(avaliacao => {
          const { avaliador, ...avaliacaoSemAvaliador } = avaliacao;
          return avaliacaoSemAvaliador;
        });
      } else if (isAvaliador && !isCoordenador && !isAutor) {
        // Avaliador vê apenas suas próprias avaliações
        avaliacoesPermitidas = avaliacoes.filter(
          avaliacao => avaliacao.avaliador.id === req.user?.id
        );
      }

      return res.status(200).json(avaliacoesPermitidas);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Artigo não encontrado') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }

  /**
   * Responde às perguntas do checklist para uma versão do artigo
   * @param req Requisição
   * @param res Resposta
   */
  async responderChecklist(req: Request, res: Response): Promise<Response> {
    try {
      // Validação dos campos
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { id } = req.params; // ID da versão do artigo
      const { perguntas } = req.body;

      // Verifica se o usuário é avaliador
      const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
      const isAvaliador = userCargos.includes(2) || userCargos.includes(1); // avaliador ou coordenador

      if (!isAvaliador) {
        return res.status(403).json({
          error: true,
          message: 'Você não tem permissão para responder ao checklist',
        });
      }

      // Responde ao checklist
      const respostas = await avaliacaoService.responderChecklist(Number(id), perguntas);

      return res.status(201).json(respostas);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Versão do artigo não encontrada') {
          return res.status(404).json({ error: true, message: error.message });
        }
        return res.status(500).json({ error: true, message: error.message });
      }
      return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
    }
  }
}

export default new AvaliacaoController();