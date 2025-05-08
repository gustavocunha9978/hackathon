"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const auth_service_1 = __importDefault(require("../services/auth.service"));
class AuthController {
    /**
     * Realiza o login do usuário
     * @param req Requisição
     * @param res Resposta
     */
    async login(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Realiza o login
            const { email, senha } = req.body;
            const authResponse = await auth_service_1.default.login({ email, senha });
            return res.status(200).json(authResponse);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Usuário não encontrado' || error.message === 'Senha incorreta') {
                    return res.status(401).json({ error: true, message: 'Credenciais inválidas' });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Verifica se o token é válido
     * @param req Requisição
     * @param res Resposta
     */
    async validateToken(req, res) {
        try {
            // Verifica se o usuário está autenticado (middleware já fez essa validação)
            if (!req.user) {
                return res.status(401).json({ error: true, message: 'Token inválido' });
            }
            return res.status(200).json({ valid: true, user: req.user });
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(401).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new AuthController();
