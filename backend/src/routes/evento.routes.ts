import { Router } from 'express';
import { body, param, query, validationResult } from 'express-validator';
import eventoController from '../controllers/evento.controller';
import { authenticate } from '../middlewares/auth.middleware';
import { isCoordenador } from '../middlewares/permission.middleware';
import multer from 'multer';

let lastFileSaved = '';
// Configuração do Multer para upload de arquivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Diretório para armazenar os arquivos
  },
  filename: (req, file, cb) => {
    let name = 'banner_' + Date.now() + '_' + Math.round(Math.random() * 1E9) + ".png";
    lastFileSaved = name;
    cb(null, name); // Renomeia o arquivo para garantir que não haja duplicatas
  }
});

const upload = multer({ storage: storage });
const router = Router();

/**
 * @route POST /eventos
 * @desc Cria um novo evento
 * @access Private (apenas coordenadores)
 */

router.post(
  '/',
  upload.single('banner'),
  [
    body('nome').notEmpty().withMessage('Nome é obrigatório'),
    body('descricao').notEmpty().withMessage('Descrição é obrigatória'),
    body('idinstituicao').notEmpty().withMessage('Instituição é obrigatória'),
    body('idtipoAvalicao').notEmpty().isInt().withMessage('Tipo de avaliação é obrigatório'),
    body('dataInicio').notEmpty().withMessage('Data de início é obrigatória'),
    body('dataFim').notEmpty().withMessage('Data de fim é obrigatória'),
  ],
  eventoController.createEvento,
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
    param('id').isInt().withMessage('ID deve ser um número inteiro'),
    body('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    body('descricao').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    body('idinstituicao').notEmpty().withMessage('Instituição é obrigatória'),
    body('idtipoAvalicao').optional().isInt().withMessage('Tipo de avaliação deve ser um número inteiro'),
    body('dataInicio').optional().isString().withMessage('Data de início deve ser uma string'),
    body('dataFim').optional().isString().withMessage('Data de fim deve ser uma string'),
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

export default router;