"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const comentario_service_1 = __importDefault(require("../services/comentario.service"));
const database_1 = __importDefault(require("../config/database"));
class ComentarioController {
    /**
     * Cria um novo comentário
     * @param req Requisição
     * @param res Resposta
     */
    async createComentario(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { id } = req.params; // ID da versão do artigo
            const { descricao } = req.body;
            // Verifica se a versão do artigo existe e se o usuário tem permissão para comentar
            const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
                where: { idversao_artigo: Number(id) },
                include: {
                    artigo: {
                        include: {
                            autores: true,
                        },
                    },
                },
            });
            if (!versaoArtigo) {
                return res.status(404).json({ error: true, message: 'Versão do artigo não encontrada' });
            }
            // Verifica se o usuário é autor, avaliador ou coordenador
            const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
            const isAutor = versaoArtigo.artigo.autores.some(autor => autor.usuario_idusuario === req.user?.id);
            const isCoordenador = userCargos.includes(1); // ID do cargo de coordenador
            const isAvaliador = userCargos.includes(2); // ID do cargo de avaliador
            if (!isAutor && !isAvaliador && !isCoordenador) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para comentar neste artigo',
                });
            }
            // Cria o comentário
            const comentario = await comentario_service_1.default.createComentario({
                descricao,
                usuarioId: req.user?.id,
                versaoArtigoId: Number(id),
            });
            return res.status(201).json(comentario);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Versão do artigo não encontrada') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Busca todos os comentários de uma versão de artigo
     * @param req Requisição
     * @param res Resposta
     */
    async getComentariosByVersaoArtigo(req, res) {
        try {
            const { id } = req.params; // ID da versão do artigo
            // Verifica se a versão do artigo existe e se o usuário tem permissão para ver os comentários
            const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
                where: { idversao_artigo: Number(id) },
                include: {
                    artigo: {
                        include: {
                            autores: true,
                        },
                    },
                },
            });
            if (!versaoArtigo) {
                return res.status(404).json({ error: true, message: 'Versão do artigo não encontrada' });
            }
            // Verifica se o usuário é autor, avaliador ou coordenador
            const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
            const isAutor = versaoArtigo.artigo.autores.some(autor => autor.usuario_idusuario === req.user?.id);
            const isCoordenador = userCargos.includes(1); // ID do cargo de coordenador
            const isAvaliador = userCargos.includes(2); // ID do cargo de avaliador
            if (!isAutor && !isAvaliador && !isCoordenador) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para ver os comentários deste artigo',
                });
            }
            const comentarios = await comentario_service_1.default.getComentariosByVersaoArtigo(Number(id));
            return res.status(200).json(comentarios);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Versão do artigo não encontrada') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new ComentarioController();
