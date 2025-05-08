"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const evento_controller_1 = __importDefault(require("../controllers/evento.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /eventos
 * @desc Cria um novo evento
 * @access Private (apenas coordenadores)
 */
router.post('/', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    upload_middleware_1.uploadBanner,
    (0, express_validator_1.body)('nome').notEmpty().withMessage('Nome é obrigatório'),
    (0, express_validator_1.body)('descricao').notEmpty().withMessage('Descrição é obrigatória'),
    (0, express_validator_1.body)('dataInicio').notEmpty().withMessage('Data de início é obrigatória'),
    (0, express_validator_1.body)('dataFim').notEmpty().withMessage('Data de fim é obrigatória'),
    (0, express_validator_1.body)('statusEventoId').isInt().withMessage('Status do evento é obrigatório'),
], evento_controller_1.default.createEvento);
/**
 * @route GET /eventos
 * @desc Busca todos os eventos
 * @access Public
 */
router.get('/', [
    (0, express_validator_1.query)('status').optional().isInt().withMessage('Status deve ser um número inteiro'),
    (0, express_validator_1.query)('dataInicio').optional().isString().withMessage('Data de início deve ser uma string'),
    (0, express_validator_1.query)('dataFim').optional().isString().withMessage('Data de fim deve ser uma string'),
], evento_controller_1.default.getAllEventos);
/**
 * @route GET /eventos/:id
 * @desc Busca um evento pelo ID
 * @access Public
 */
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], evento_controller_1.default.getEventoById);
/**
 * @route PUT /eventos/:id
 * @desc Atualiza um evento
 * @access Private (apenas coordenadores)
 */
router.put('/:id', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    upload_middleware_1.uploadBanner,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    (0, express_validator_1.body)('descricao').optional().notEmpty().withMessage('Descrição não pode ser vazia'),
    (0, express_validator_1.body)('dataInicio').optional().isString().withMessage('Data de início deve ser uma string'),
    (0, express_validator_1.body)('dataFim').optional().isString().withMessage('Data de fim deve ser uma string'),
    (0, express_validator_1.body)('statusEventoId').optional().isInt().withMessage('Status do evento deve ser um número inteiro'),
], evento_controller_1.default.updateEvento);
/**
 * @route DELETE /eventos/:id
 * @desc Exclui um evento
 * @access Private (apenas coordenadores)
 */
router.delete('/:id', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], evento_controller_1.default.deleteEvento);
/**
 * @route POST /eventos/:id/checklist
 * @desc Cria um checklist para um evento
 * @access Private (apenas coordenadores)
 */
router.post('/:id/checklist', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    (0, express_validator_1.body)('perguntas.*.descricao').notEmpty().withMessage('Descrição da pergunta é obrigatória'),
], evento_controller_1.default.createChecklist);
/**
 * @route GET /status-eventos
 * @desc Busca todos os status de evento
 * @access Public
 */
router.get('/status-eventos', evento_controller_1.default.getAllStatusEvento);
exports.default = router;
