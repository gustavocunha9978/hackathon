"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const avaliacao_controller_1 = __importDefault(require("../controllers/avaliacao.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const upload_middleware_1 = require("../middlewares/upload.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /versoes/:id/avaliacoes
 * @desc Cria uma nova avaliação
 * @access Private (apenas avaliadores)
 */
router.post('/versoes/:id/avaliacoes', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isAvaliador,
    upload_middleware_1.uploadArtigoPdf,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('nota').notEmpty().withMessage('Nota é obrigatória'),
    (0, express_validator_1.body)('observacao').notEmpty().withMessage('Observação é obrigatória'),
], avaliacao_controller_1.default.createAvaliacao);
/**
 * @route GET /artigos/:id/avaliacoes
 * @desc Busca todas as avaliações de um artigo
 * @access Private
 */
router.get('/artigos/:id/avaliacoes', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], avaliacao_controller_1.default.getAvaliacoesByArtigo);
/**
 * @route POST /versoes/:id/perguntas
 * @desc Responde às perguntas do checklist para uma versão do artigo
 * @access Private (apenas avaliadores)
 */
router.post('/versoes/:id/perguntas', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isAvaliador,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('perguntas').isArray().withMessage('Perguntas deve ser um array'),
    (0, express_validator_1.body)('perguntas.*.perguntaIdpergunta').isInt().withMessage('ID da pergunta é obrigatório'),
    (0, express_validator_1.body)('perguntas.*.checked').isBoolean().withMessage('Checked deve ser um booleano'),
], avaliacao_controller_1.default.responderChecklist);
exports.default = router;
