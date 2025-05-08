"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.AppError = void 0;
class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({
            error: true,
            message: err.message,
        });
    }
    // Se for um erro de validação
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            error: true,
            message: err.message,
        });
    }
    // Se for um erro de autenticação
    if (err.name === 'UnauthorizedError') {
        return res.status(401).json({
            error: true,
            message: 'Acesso não autorizado',
        });
    }
    // Se for um erro do Prisma
    if (err.name === 'PrismaClientKnownRequestError') {
        return res.status(400).json({
            error: true,
            message: 'Erro ao acessar o banco de dados',
        });
    }
    // Se for um erro do Multer
    if (err.name === 'MulterError') {
        return res.status(400).json({
            error: true,
            message: err.message,
        });
    }
    // Erro genérico
    return res.status(500).json({
        error: true,
        message: 'Erro interno do servidor',
    });
};
exports.errorHandler = errorHandler;
