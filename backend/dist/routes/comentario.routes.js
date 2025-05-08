"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const comentario_controller_1 = __importDefault(require("../controllers/comentario.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /versoes/:id/comentarios
 * @desc Cria um novo comentário
 * @access Private
 */
router.post('/versoes/:id/comentarios', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('descricao').notEmpty().withMessage('Descrição é obrigatória'),
], comentario_controller_1.default.createComentario);
/**
 * @route GET /versoes/:id/comentarios
 * @desc Busca todos os comentários de uma versão de artigo
 * @access Private
 */
router.get('/versoes/:id/comentarios', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], comentario_controller_1.default.getComentariosByVersaoArtigo);
exports.default = router;
