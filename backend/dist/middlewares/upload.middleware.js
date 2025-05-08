"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadBanner = exports.uploadArtigoPdf = exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
// Garante que a pasta de uploads existe
const uploadDir = path_1.default.join(__dirname, '../../', env_1.config.uploadDir);
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
// Configuração do armazenamento
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1E9);
        const ext = path_1.default.extname(file.originalname);
        cb(null, file.fieldname + '_' + uniqueSuffix + ext);
    }
});
// Filtro para permitir apenas PDFs
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    }
    else {
        cb(new Error('Apenas arquivos PDF são permitidos'));
    }
};
// Configuração do multer
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: env_1.config.maxFileSize // Tamanho máximo do arquivo
    },
    fileFilter: fileFilter
});
// Configuração específica para upload de PDF de artigos
exports.uploadArtigoPdf = exports.upload.single('arquivo');
// Configuração para upload de imagens (banners de eventos)
exports.uploadBanner = (0, multer_1.default)({
    storage: storage,
    limits: {
        fileSize: env_1.config.maxFileSize
    },
    fileFilter: (req, file, cb) => {
        const allowedMimes = [
            'image/jpeg',
            'image/png',
            'image/gif'
        ];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        }
        else {
            cb(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.'));
        }
    }
}).single('banner');
