"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyzeController = void 0;
const analyzePdfWithOllama_1 = require("@/services/analyzePdfWithOllama");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.AnalyzeController = {
    async handle(req, res) {
        try {
            console.log("📥 Requisição recebida");
            const file = req.file;
            if (!file) {
                console.log("❌ Nenhum arquivo enviado");
                return res.status(400).json({ error: "Nenhum arquivo enviado." });
            }
            const filePath = path_1.default.resolve(file.path);
            console.log("📄 Caminho do arquivo:", filePath);
            if (!fs_1.default.existsSync(filePath)) {
                console.log("❌ Arquivo não encontrado no servidor");
                return res.status(404).json({ error: "Arquivo não encontrado." });
            }
            const feedback = await (0, analyzePdfWithOllama_1.analyzePdfWithOllama)(filePath);
            console.log("✅ Feedback gerado");
            return res.json({ feedback });
        }
        catch (error) {
            console.error("💥 Erro no processamento:", error);
            return res.status(500).json({ error: "Erro interno no servidor." });
        }
    },
};
