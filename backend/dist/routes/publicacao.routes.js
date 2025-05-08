"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const publicacao_controller_1 = __importDefault(require("../controllers/publicacao.controller"));
const router = (0, express_1.Router)();
/**
 * @route GET /publicacoes
 * @desc Busca todos os artigos aprovados
 * @access Public
 */
router.get('/', [
    (0, express_validator_1.query)('evento').optional().isInt().withMessage('Evento deve ser um número inteiro'),
    (0, express_validator_1.query)('areaTematica').optional().isString().withMessage('Área temática deve ser uma string'),
    (0, express_validator_1.query)('autor').optional().isInt().withMessage('Autor deve ser um número inteiro'),
    (0, express_validator_1.query)('palavraChave').optional().isString().withMessage('Palavra-chave deve ser uma string'),
], publicacao_controller_1.default.getAllArtigosAprovados);
/**
 * @route GET /publicacoes/:id
 * @desc Busca um artigo aprovado pelo ID
 * @access Public
 */
router.get('/:id', [
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], publicacao_controller_1.default.getArtigoAprovadoById);
exports.default = router;
