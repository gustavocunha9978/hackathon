"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzePdfWithOllama = analyzePdfWithOllama;
const fs_1 = __importDefault(require("fs"));
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const ollamaClient_1 = require("@/utils/ollamaClient");
async function analyzePdfWithOllama(filePath) {
    const buffer = fs_1.default.readFileSync(filePath);
    const data = await (0, pdf_parse_1.default)(buffer);
    const prompt = `Leia o seguinte conteúdo extraído de um PDF e forneça um feedback técnico e objetivo:\n\n${data.text}`;
    const feedback = await (0, ollamaClient_1.askOllama)(prompt);
    return feedback;
}
