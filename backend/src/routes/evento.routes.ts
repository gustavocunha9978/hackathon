import { Router } from 'express';
import { body, param, query } from 'express-validator';
import eventoController from '../controllers/evento.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isCoordenador } from '../middlewares/permission.middleware';
import { uploadBanner } from '../middlewares/upload.middleware';

const router = Router();

/**
 * @route POST /eventos
 * @desc Cria um novo evento
 * @access Private (apenas coordenadores)
 */
router.post(
  '/',
  [
    uploadBanner,
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
    body('dataInicio').notEmpty().withMessage('Data de início é obrigatória'),
    body('dataFim').notEmpty().withMessage('Data de fim é obrigatória'),
    body('statusEventoId').isInt().withMessage('Status do evento é obrigatório'),
  ],
  eventoController.createEvento
);

/**
 * @route GET /eventos
 * @desc Busca todos os eventos
 * @access Public
 */
router.get(
  '/',
  [
    query('status').optional().isInt().withMessage('Status deve ser um número inteiro'),
    query('dataInicio').optional().isString().withMessage('Data de início deve ser uma string'),
    query('dataFim').optional().isString().withMessage('Data de fim deve ser uma string'),
  ],
  eventoController.getAllEventos
);

/**
 * @route GET /eventos/:id
 * @desc Busca um evento pelo ID
 * @access Public
 */
router.get(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  eventoController.getEventoById
);

/**
 * @route PUT /eventos/:id
 * @desc Atualiza um evento
 * @access Private (apenas coordenadores)
 */
router.put(
  '/:id',
  [
    uploadBanner,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('descricao').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('dataInicio').optional().isString().withMessage('Data de início deve ser uma string'),
    body('dataFim').optional().isString().withMessage('Data de fim deve ser uma string'),
    body('statusEventoId').optional().isInt().withMessage('Status do evento deve ser um número inteiro'),
  ],
  eventoController.updateEvento
);

/**
 * @route DELETE /eventos/:id
 * @desc Exclui um evento
 * @access Private (apenas coordenadores)
 */
router.delete(
  '/:id',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  eventoController.deleteEvento
);

/**
 * @route POST /eventos/:id/avaliadores
 * @desc Adiciona avaliadores a um evento
 * @access Private (apenas coordenadores)
 */
router.post(
  '/:id/avaliadores',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('avaliadoresIds').isArray().withMessage('avaliadoresIds deve ser um array'),
    body('avaliadoresIds.*').isInt().withMessage('IDs dos avaliadores devem ser números inteiros'),
  ],
  eventoController.addAvaliadoresEvento
);

/**
 * @route DELETE /eventos/:id/avaliadores
 * @desc Remove avaliadores de um evento
 * @access Private (apenas coordenadores)
 */
router.delete(
  '/:id/avaliadores',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('avaliadoresIds').isArray().withMessage('avaliadoresIds deve ser um array'),
    body('avaliadoresIds.*').isInt().withMessage('IDs dos avaliadores devem ser números inteiros'),
  ],
  eventoController.removeAvaliadoresEvento
);

/**
 * @route GET /eventos/:id/avaliadores
 * @desc Obtém os avaliadores de um evento
 * @access Private
 */
router.get(
  '/:id/avaliadores',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  eventoController.getAvaliadoresEvento
);

/**
 * @route POST /eventos/:id/checklist
 * @desc Cria um checklist para um evento
 * @access Private (apenas coordenadores)
 */
router.post(
  '/:id/checklist',
  [
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    body('perguntas.*.descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
  ],
  eventoController.createChecklist
);

/**
 * @route GET /status-eventos
 * @desc Busca todos os status de evento
 * @access Public
 */
router.get('/status-eventos', eventoController.getAllStatusEvento);

export default router;