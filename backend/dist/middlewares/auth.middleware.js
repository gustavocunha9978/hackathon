"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticate = (req, res, next) => {
    // Verifica se o token está presente no header Authorization
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ error: true, message: 'Token não fornecido' });
    }
    // Formato esperado: "Bearer <token>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2) {
        return res.status(401).json({ error: true, message: 'Erro no formato do token' });
    }
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) {
        return res.status(401).json({ error: true, message: 'Token mal formatado' });
    }
    // Verifica se o token é válido
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        req.user = decoded.user;
        return next();
    }
    catch (err) {
        return res.status(401).json({ error: true, message: 'Token inválido' });
    }
};
exports.authenticate = authenticate;
