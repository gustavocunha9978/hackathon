"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
/**
 * @route POST /auth/login
 * @desc Autentica um usuário
 * @access Public
 */
router.post('/login', [
    (0, express_validator_1.body)('email').isEmail().withMessage('Email inválido'),
    (0, express_validator_1.body)('senha').isLength({ min: 6 }).withMessage('A senha deve ter pelo menos 6 caracteres'),
], auth_controller_1.default.login);
/**
 * @route GET /auth/verify
 * @desc Verifica se o token é válido
 * @access Private
 */
router.get('/verify', auth_middleware_1.authenticate, auth_controller_1.default.validateToken);
exports.default = router;
