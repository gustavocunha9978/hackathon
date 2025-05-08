"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const path_1 = __importDefault(require("path"));
const env_1 = require("./config/env");
const routes_1 = __importDefault(require("./routes"));
class App {
    constructor() {
        this.app = (0, express_1.default)();
        this.middlewares();
        this.routes();
        this.errorHandler();
    }
    middlewares() {
        this.app.use((0, cors_1.default)());
        this.app.use((0, helmet_1.default)());
        this.app.use((0, compression_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: true }));
        // Configuração para servir arquivos estáticos (uploads)
        this.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '..', env_1.config.uploadDir)));
    }
    routes() {
        this.app.use('/api', routes_1.default);
    }
    errorHandler() {
        // Middleware para tratamento de erros
        this.app.use((err, req, res, next) => {
            console.error(err.stack);
            if (err.name === 'ValidationError') {
                return res.status(400).json({
                    error: true,
                    message: err.message,
                });
            }
            if (err.name === 'UnauthorizedError') {
                return res.status(401).json({
                    error: true,
                    message: 'Acesso não autorizado',
                });
            }
            return res.status(500).json({
                error: true,
                message: 'Erro interno do servidor',
            });
        });
    }
}
exports.default = new App().app;
