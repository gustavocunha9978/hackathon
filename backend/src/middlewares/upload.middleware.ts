import { Request } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config/env';

// Garante que a pasta de uploads existe
const uploadDir = path.join(__dirname, '../../', config.uploadDir);
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configuração do armazenamento
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtro para permitir apenas PDFs
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Apenas arquivos PDF são permitidos'));
  }
};

// Configuração do multer
export const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.maxFileSize // Tamanho máximo do arquivo
  },
  fileFilter: fileFilter
});

// Configuração específica para upload de PDF de artigos
export const uploadArtigoPdf = upload.single('pdf');

