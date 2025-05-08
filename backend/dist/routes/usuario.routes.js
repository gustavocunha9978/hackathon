"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const usuario_controller_1 = __importDefault(require("../controllers/usuario.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const permission_middleware_1 = require("../middlewares/permission.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /usuarios
 * @desc Cria um novo usuário
 * @access Public
 */
router.post('/', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    (0, express_validator_1.body)('nome').notEmpty().withMessage('Nome é obrigatório'),
    (0, express_validator_1.body)('dataNascimento').notEmpty().withMessage('Data de nascimento é obrigatória'),
    (0, express_validator_1.body)('cargos').optional().isArray().withMessage('Cargos deve ser um array'),
], usuario_controller_1.default.createUsuario);
/**
 * @route GET /usuarios
 * @desc Busca todos os usuários
 * @access Private (apenas coordenadores)
 */
router.get('/', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.query)('cargo').optional().isInt().withMessage('Cargo deve ser um número inteiro'),
], usuario_controller_1.default.getAllUsuarios);
/**
 * @route GET /usuarios/:id
 * @desc Busca um usuário pelo ID
 * @access Private
 */
router.get('/:id', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], usuario_controller_1.default.getUsuarioById);
/**
 * @route PUT /usuarios/:id
 * @desc Atualiza um usuário
 * @access Private
 */
router.put('/:id', [
    auth_middleware_1.authenticate,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('senha').optional().isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
    (0, express_validator_1.body)('nome').optional().notEmpty().withMessage('Nome não pode ser vazio'),
    (0, express_validator_1.body)('dataNascimento').optional().notEmpty().withMessage('Data de nascimento não pode ser vazia'),
    (0, express_validator_1.body)('cargos').optional().isArray().withMessage('Cargos deve ser um array'),
], usuario_controller_1.default.updateUsuario);
/**
 * @route DELETE /usuarios/:id
 * @desc Exclui um usuário
 * @access Private (apenas coordenadores)
 */
router.delete('/:id', [
    auth_middleware_1.authenticate,
    permission_middleware_1.isCoordenador,
    (0, express_validator_1.param)('id').isInt().withMessage('ID deve ser um número inteiro'),
], usuario_controller_1.default.deleteUsuario);
exports.default = router;
