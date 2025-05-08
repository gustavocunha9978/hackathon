import { Router } from 'express';
import { body, param } from 'express-validator';
import checklistController from '../controllers/checklist.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isCoordenador } from '../middlewares/permission.middleware';

const router = Router();

/**
 * @route POST /eventos/:eventoId/checklists
 * @desc Cria um checklist para um evento
 * @access Private (apenas coordenadores)
 */
router.post(
  '/eventos/:eventoId/checklists',
  [
    authenticate,
    isCoordenador,
    param('eventoId').isInt().withMessage('ID do evento deve ser um número inteiro'),
    body('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    body('perguntas.*.descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
  ],
  checklistController.createChecklist
);

/**
 * @route GET /checklists/:id
 * @desc Busca um checklist pelo ID
 * @access Private
 */
router.get(
  '/checklists/:id',
  [
    authenticate,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  checklistController.getChecklistById
);

/**
 * @route GET /eventos/:eventoId/checklists
 * @desc Busca um checklist pelo ID do evento
 * @access Private
 */
router.get(
  '/eventos/:eventoId/checklists',
  [
    authenticate,
    param('eventoId').isInt().withMessage('ID do evento deve ser um número inteiro'),
  ],
  checklistController.getChecklistByEventoId
);

/**
 * @route PUT /checklists/:id
 * @desc Atualiza um checklist
 * @access Private (apenas coordenadores)
 */
router.put(
  '/checklists/:id',
  [
    authenticate,
    isCoordenador,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    body('perguntas.*.descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
  ],
  checklistController.updateChecklist
);

/**
 * @route POST /checklists/:checklistId/perguntas
 * @desc Adiciona uma pergunta ao checklist
 * @access Private (apenas coordenadores)
 */
router.post(
  '/checklists/:checklistId/perguntas',
  [
    authenticate,
    isCoordenador,
    param('checklistId').isInt().withMessage('ID do checklist deve ser um número inteiro'),
    body('descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
  ],
  checklistController.addPergunta
);

/**
 * @route PUT /perguntas/:perguntaId
 * @desc Atualiza uma pergunta
 * @access Private (apenas coordenadores)
 */
router.put(
  '/perguntas/:perguntaId',
  [
    authenticate,
    isCoordenador,
    param('perguntaId').isInt().withMessage('ID da pergunta deve ser um número inteiro'),
    body('descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
  ],
  checklistController.updatePergunta
);

/**
 * @route DELETE /perguntas/:perguntaId
 * @desc Exclui uma pergunta
 * @access Private (apenas coordenadores)
 */
router.delete(
  '/perguntas/:perguntaId',
  [
    authenticate,
    isCoordenador,
    param('perguntaId').isInt().withMessage('ID da pergunta deve ser um número inteiro'),
  ],
  checklistController.deletePergunta
);

/**
 * @route DELETE /checklists/:id
 * @desc Exclui um checklist
 * @access Private (apenas coordenadores)
 */
router.delete(
  '/checklists/:id',
  [
    authenticate,
    isCoordenador,
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
  ],
  checklistController.deleteChecklist
);

export default router;