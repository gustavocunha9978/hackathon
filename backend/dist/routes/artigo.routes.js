"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const artigo_controller_1 = __importDefault(require("../controllers/artigo.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /artigos
 * @desc Cria um novo artigo
 * @access Private
 */
router.post('/', [
    auth_middleware_1.authenticate,
    upload_middleware_1.uploadArtigoPdf,
    (0, express_validator_1.body)('titulo').notEmpty().withMessage('Título é obrigatório'),
    (0, express_validator_1.body)('resumo').notEmpty().withMessage('Resumo é obrigatório'),
    (0, express_validator_1.body)('areaTematica').notEmpty().withMessage('Área temática é obrigatória'),
    (0, express_validator_1.body)('evento').isInt().withMessage('Evento é obrigatório'),
    (0, express_validator_1.body)('autoresIds').optional(),
    (0, express_validator_1.body)('palavrasChave').optional(),
], artigo_controller_1.default.createArtigo);
/**
 * @route GET /artigos
 * @desc Busca todos os artigos
 * @access Private (apenas coordenadores)
 */
router.get('/', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.query)('evento').optional().isInt().withMessage('Evento deve ser um número inteiro'),
    (0, express_validator_1.query)('areaTematica').optional().isString().withMessage('Área temática deve ser uma string'),
    (0, express_validator_1.query)('autor').optional().isInt().withMessage('Autor deve ser um número inteiro'),
    (0, express_validator_1.query)('palavraChave').optional().isString().withMessage('Palavra-chave deve ser uma string'),
    (0, express_validator_1.query)('status').optional().isInt().withMessage('Status deve ser um número inteiro'),
], artigo_controller_1.default.getAllArtigos);
/**
 * @route GET /artigos/:id
 * @desc Busca um artigo pelo ID
 * @access Private
 */
router.get('/:id', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], artigo_controller_1.default.getArtigoById);
/**
 * @route PUT /artigos/:id
 * @desc Atualiza um artigo
 * @access Private
 */
router.put('/:id', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('titulo').optional().notEmpty().withMessage('Título não pode ser vazio'),
    (0, express_validator_1.body)('resumo').optional().notEmpty().withMessage('Resumo não pode ser vazio'),
    (0, express_validator_1.body)('areaTematica').optional().notEmpty().withMessage('Área temática não pode ser vazia'),
    (0, express_validator_1.body)('autoresIds').optional(),
    (0, express_validator_1.body)('palavrasChave').optional(),
], artigo_controller_1.default.updateArtigo);
/**
 * @route PUT /artigos/:id/status
 * @desc Atualiza o status de um artigo
 * @access Private (apenas coordenadores)
 */
router.put('/:id/status', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('statusArtigoId').isInt().withMessage('Status do artigo é obrigatório'),
], artigo_controller_1.default.updateStatusArtigo);
/**
 * @route POST /artigos/:id/versoes
 * @desc Envia uma nova versão do artigo
 * @access Private
 */
router.post('/:id/versoes', [
    auth_middleware_1.authenticate,
    upload_middleware_1.uploadArtigoPdf,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], artigo_controller_1.default.enviarNovaVersao);
/**
 * @route GET /usuarios/:id/artigos
 * @desc Busca os artigos de um autor
 * @access Private
 */
router.get('/usuarios/:id/artigos', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], artigo_controller_1.default.getArtigosByAutor);
/**
 * @route GET /avaliadores/:id/artigos
 * @desc Busca os artigos para avaliação de um avaliador
 * @access Private
 */
router.get('/avaliadores/:id/artigos', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], artigo_controller_1.default.getArtigosParaAvaliacao);
/**
 * @route GET /status-artigos
 * @desc Busca todos os status de artigo
 * @access Public
 */
router.get('/status-artigos', artigo_controller_1.default.getAllStatusArtigo);
exports.default = router;
