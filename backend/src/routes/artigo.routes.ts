import { Router } from 'express';
import { body, param, query } from 'express-validator';
import artigoController from '../controllers/artigo.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isCoordenador } from '../middlewares/permission.middleware';
import { uploadArtigoPdf } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @route POST /artigos
 * @desc Cria um novo artigo
 * @access Private
 */
router.post(
  '/',
  [
    uploadArtigoPdf,
    body('titulo').notEmpty().withMessage('Título é obrigatório'),
    body('resumo').notEmpty().withMessage('Resumo é obrigatório'),
    body('areaTematica').notEmpty().withMessage('Área temática é obrigatória'),
    body('evento').isInt().withMessage('Evento é obrigatório'),
    body('autoresIds').notEmpty().withMessage('Autores são obrigatorios.'),
    body('palavrasChave').optional(),
  ],
  artigoController.createArtigo
);

/**
 * @route GET /artigos
 * @desc Busca todos os artigos
 * @access Private (apenas coordenadores)
 */
router.get(
  '/',
  [
    query('evento').optional().isInt().withMessage('Evento deve ser um número inteiro'),
    query('areaTematica').optional().isString().withMessage('Área temática deve ser uma string'),
    query('autor').optional().isInt().withMessage('Autor deve ser um número inteiro'),
    query('palavraChave').optional().isString().withMessage('Palavra-chave deve ser uma string'),
    query('status').optional().isInt().withMessage('Status deve ser um número inteiro'),
  ],
  artigoController.getAllArtigos
);

/**
 * @route GET /artigos/:id
 * @desc Busca um artigo pelo ID
 * @access Private
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  artigoController.getArtigoById
);

/**
 * @route PUT /artigos/:id
 * @desc Atualiza um artigo
 * @access Private
 */
router.put(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('titulo').optional().notEmpty().withMessage('Título não pode ser vazio'),
    body('resumo').optional().notEmpty().withMessage('Resumo não pode ser vazio'),
    body('areaTematica').optional().notEmpty().withMessage('Área temática não pode ser vazia'),
    body('autoresIds').optional(),
    body('palavrasChave').optional(),
  ],
  artigoController.updateArtigo
);

/**
 * @route PUT /artigos/:id/status
 * @desc Atualiza o status de um artigo
 * @access Private (apenas coordenadores)
 */
router.put(
  '/:id/status',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('statusArtigoId').isInt().withMessage('Status do artigo é obrigatório'),
  ],
  artigoController.updateStatusArtigo
);

/**
 * @route POST /artigos/:id/versoes
 * @desc Envia uma nova versão do artigo
 * @access Private
 */
router.post(
  '/:id/versoes',
  [
    uploadArtigoPdf,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  artigoController.enviarNovaVersao
);

/**
 * @route GET /usuarios/:id/artigos
 * @desc Busca os artigos de um autor
 * @access Private
 */
router.get(
  '/usuarios/:id/artigos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  artigoController.getArtigosByAutor
);

/**
 * @route GET /avaliadores/:id/artigos
 * @desc Busca os artigos para avaliação de um avaliador
 * @access Private
 */
router.get(
  '/avaliadores/:id/artigos',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  artigoController.getArtigosParaAvaliacao
);

/**
 * @route GET /status-artigos
 * @desc Busca todos os status de artigo
 * @access Public
 */
router.get('/status-artigos', artigoController.getAllStatusArtigo);

export default router;