"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const publicacao_service_1 = __importDefault(require("../services/publicacao.service"));
class PublicacaoController {
    /**
     * Busca todos os artigos aprovados
     * @param req Requisição
     * @param res Resposta
     */
    async getAllArtigosAprovados(req, res) {
        try {
            const { evento, areaTematica, autor, palavraChave } = req.query;
            const artigos = await publicacao_service_1.default.getAllArtigosAprovados({
                evento: evento ? Number(evento) : undefined,
                areaTematica: areaTematica ? String(areaTematica) : undefined,
                autor: autor ? Number(autor) : undefined,
                palavraChave: palavraChave ? String(palavraChave) : undefined,
            });
            return res.status(200).json(artigos);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Busca um artigo aprovado pelo ID
     * @param req Requisição
     * @param res Resposta
     */
    async getArtigoAprovadoById(req, res) {
        try {
            const { id } = req.params;
            const artigo = await publicacao_service_1.default.getArtigoAprovadoById(Number(id));
            return res.status(200).json(artigo);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Artigo não encontrado ou não está aprovado') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new PublicacaoController();
