import { Router } from 'express';
import { param, query } from 'express-validator';
import publicacaoController from '../controllers/publicacao.controller';

const router = Router();

/**
 * @route GET /publicacoes
 * @desc Busca todos os artigos aprovados
 * @access Public
 */
router.get(
  '/',
  [
    query('evento').optional().isInt().withMessage('Evento deve ser um número inteiro'),
    query('areaTematica').optional().isString().withMessage('Área temática deve ser uma string'),
    query('autor').optional().isInt().withMessage('Autor deve ser um número inteiro'),
    query('palavraChave').optional().isString().withMessage('Palavra-chave deve ser uma string'),
  ],
  publicacaoController.getAllArtigosAprovados
);

/**
 * @route GET /publicacoes/:id
 * @desc Busca um artigo aprovado pelo ID
 * @access Public
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  publicacaoController.getArtigoAprovadoById
);

export default router;