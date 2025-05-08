"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const artigo_service_1 = __importDefault(require("../services/artigo.service"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
class ArtigoController {
    /**
     * Cria um novo artigo
     * @param req Requisição
     * @param res Resposta
     */
    async createArtigo(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Verifica se o arquivo foi enviado
            if (!req.file) {
                return res.status(400).json({ error: true, message: 'Arquivo PDF é obrigatório' });
            }
            // Caminho do arquivo
            const caminhoPdf = `/uploads/${req.file.filename}`;
            // Extrai e converte os valores apropriadamente
            const { titulo, resumo, areaTematica, evento, autoresIds, palavrasChave } = req.body;
            const autoresIdsArray = JSON.parse(autoresIds || '[]');
            const palavrasChaveArray = JSON.parse(palavrasChave || '[]');
            const eventoId = Number(evento);
            // Adiciona o autor atual à lista de autores se necessário
            if (req.user && !autoresIdsArray.includes(req.user.id)) {
                autoresIdsArray.push(req.user.id);
            }
            // Cria o artigo
            const artigo = await artigo_service_1.default.createArtigo({
                titulo,
                resumo,
                areaTematica,
                eventoId,
                autoresIds: autoresIdsArray,
                palavrasChave: palavrasChaveArray,
                caminhoPdf,
            });
            return res.status(201).json(artigo);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Busca um artigo pelo ID
     * @param req Requisição
     * @param res Resposta
     */
    async getArtigoById(req, res) {
        try {
            const { id } = req.params;
            const artigo = await artigo_service_1.default.getArtigoById(Number(id));
            // Verifica se o usuário tem permissão para acessar o artigo (autor, avaliador ou coordenador)
            const userCargos = req.user?.cargos.map(cargo => cargo.idcargo) || [];
            const isAutor = artigo.autores.some(autor => autor.usuario.idusuario === req.user?.id);
            const isCoordenador = userCargos.includes(1); // ID do cargo de coordenador
            const isAvaliador = userCargos.includes(2); // ID do cargo de avaliador
            // Se não for autor, avaliador ou coordenador, só pode visualizar artigos aprovados
            if (!isAutor && !isAvaliador && !isCoordenador && artigo.statusArtigo.id !== 3) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para acessar este artigo',
                });
            }
            // Se for avaliador mas não coordenador, remove informações de autoria
            if (isAvaliador && !isCoordenador && !isAutor) {
                // Sistema double-blind: remove identificação de autores
                delete artigo.autores;
            }
            return res.status(200).json(artigo);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Artigo não encontrado') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Busca todos os artigos
     * @param req Requisição
     * @param res Resposta
     */
    async getAllArtigos(req, res) {
        try {
            const { evento, areaTematica, autor, palavraChave, status } = req.query;
            const artigos = await artigo_service_1.default.getAllArtigos({
                evento: evento ? Number(evento) : undefined,
                areaTematica: areaTematica ? String(areaTematica) : undefined,
                autor: autor ? Number(autor) : undefined,
                palavraChave: palavraChave ? String(palavraChave) : undefined,
                status: status ? Number(status) : undefined,
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
     * Busca os artigos de um autor
     * @param req Requisição
     * @param res Resposta
     */
    async getArtigosByAutor(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o usuário está tentando acessar seus próprios artigos ou se é coordenador
            if (req.user?.id !== Number(id) && !req.user?.cargos.some(cargo => cargo.idcargo === 1)) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para acessar os artigos deste autor',
                });
            }
            const artigos = await artigo_service_1.default.getArtigosByAutor(Number(id));
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
     * Busca os artigos para avaliação de um avaliador
     * @param req Requisição
     * @param res Resposta
     */
    async getArtigosParaAvaliacao(req, res) {
        try {
            const { id } = req.params;
            // Verifica se o usuário está tentando acessar seus próprios artigos para avaliação ou se é coordenador
            if (req.user?.id !== Number(id) && !req.user?.cargos.some(cargo => cargo.idcargo === 1)) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para acessar os artigos para avaliação deste avaliador',
                });
            }
            const artigos = await artigo_service_1.default.getArtigosParaAvaliacao(Number(id));
            // Sistema double-blind: remove identificação de autores
            const artigosSemAutores = artigos.map((artigo) => {
                const { autores, ...artigoSemAutores } = artigo;
                return artigoSemAutores;
            });
            return res.status(200).json(artigosSemAutores);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Atualiza o status de um artigo
     * @param req Requisição
     * @param res Resposta
     */
    async updateStatusArtigo(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { id } = req.params;
            const { statusArtigoId } = req.body;
            const artigo = await artigo_service_1.default.updateStatusArtigo(Number(id), Number(statusArtigoId));
            return res.status(200).json(artigo);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Artigo não encontrado' || error.message === 'Status de artigo não encontrado') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Envia uma nova versão do artigo
     * @param req Requisição
     * @param res Resposta
     */
    async enviarNovaVersao(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // Verifica se o arquivo foi enviado
            if (!req.file) {
                return res.status(400).json({ error: true, message: 'Arquivo PDF é obrigatório' });
            }
            const { id } = req.params;
            const caminhoPdf = `/uploads/${req.file.filename}`;
            // Verifica se o usuário é autor do artigo
            const artigo = await artigo_service_1.default.getArtigoById(Number(id));
            const isAutor = artigo.autores.some(autor => autor.usuario.idusuario === req.user?.id);
            const isCoordenador = req.user?.cargos.some(cargo => cargo.idcargo === 1);
            if (!isAutor && !isCoordenador) {
                // Remove o arquivo enviado
                const filePath = path_1.default.join(__dirname, '../../', env_1.config.uploadDir, req.file.filename);
                fs_1.default.unlinkSync(filePath);
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para enviar uma nova versão deste artigo',
                });
            }
            const novaVersao = await artigo_service_1.default.enviarNovaVersao(Number(id), caminhoPdf);
            return res.status(201).json(novaVersao);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Artigo não encontrado') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                if (error.message === 'O artigo não está em status que permite envio de nova versão') {
                    return res.status(400).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Atualiza um artigo
     * @param req Requisição
     * @param res Resposta
     */
    async updateArtigo(req, res) {
        try {
            // Validação dos campos
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            const { id } = req.params;
            // Verifica se o usuário é autor do artigo ou coordenador
            const artigo = await artigo_service_1.default.getArtigoById(Number(id));
            const isAutor = artigo.autores.some(autor => autor.usuario.idusuario === req.user?.id);
            const isCoordenador = req.user?.cargos.some(cargo => cargo.idcargo === 1);
            if (!isAutor && !isCoordenador) {
                return res.status(403).json({
                    error: true,
                    message: 'Você não tem permissão para atualizar este artigo',
                });
            }
            const { titulo, resumo, areaTematica, autoresIds, palavrasChave } = req.body;
            const autoresIdsArray = autoresIds ? JSON.parse(autoresIds) : undefined;
            const palavrasChaveArray = palavrasChave ? JSON.parse(palavrasChave) : undefined;
            const artigoAtualizado = await artigo_service_1.default.updateArtigo(Number(id), {
                titulo,
                resumo,
                areaTematica,
                autoresIds: autoresIdsArray,
                palavrasChave: palavrasChaveArray,
            });
            return res.status(200).json(artigoAtualizado);
        }
        catch (error) {
            if (error instanceof Error) {
                if (error.message === 'Artigo não encontrado') {
                    return res.status(404).json({ error: true, message: error.message });
                }
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
    /**
     * Busca todos os status de artigo
     * @param req Requisição
     * @param res Resposta
     */
    async getAllStatusArtigo(req, res) {
        try {
            const statusArtigos = await artigo_service_1.default.getAllStatusArtigo();
            return res.status(200).json(statusArtigos);
        }
        catch (error) {
            if (error instanceof Error) {
                return res.status(500).json({ error: true, message: error.message });
            }
            return res.status(500).json({ error: true, message: 'Erro interno do servidor' });
        }
    }
}
exports.default = new ArtigoController();
