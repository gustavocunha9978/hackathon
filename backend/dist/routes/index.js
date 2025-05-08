"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("./auth.routes"));
const usuario_routes_1 = __importDefault(require("./usuario.routes"));
const evento_routes_1 = __importDefault(require("./evento.routes"));
const artigo_routes_1 = __importDefault(require("./artigo.routes"));
const avaliacao_routes_1 = __importDefault(require("./avaliacao.routes"));
const comentario_routes_1 = __importDefault(require("./comentario.routes"));
const publicacao_routes_1 = __importDefault(require("./publicacao.routes"));
const analyze_routes_1 = __importDefault(require("./analyze.routes"));
const router = (0, express_1.Router)();
router.use('/analyze', analyze_routes_1.default);
// Rotas de autenticação
router.use('/auth', auth_routes_1.default);
// Rotas de usuários
router.use('/usuarios', usuario_routes_1.default);
// Rotas de eventos
router.use('/eventos', evento_routes_1.default);
// Rotas de artigos
router.use('/artigos', artigo_routes_1.default);
// Rotas de avaliações
router.use('/', avaliacao_routes_1.default);
// Rotas de comentários
router.use('/', comentario_routes_1.default);
// Rotas de publicações
router.use('/publicacoes', publicacao_routes_1.default);
// Rotas de utilidade
router.get('/status-artigos', (req, res) => {
    const statusArtigos = [
        { idstatusArtigo: 1, descricao: 'Em Avaliação' },
        { idstatusArtigo: 2, descricao: 'Em Revisão' },
        { idstatusArtigo: 3, descricao: 'Aprovado' },
        { idstatusArtigo: 4, descricao: 'Reprovado' },
    ];
    return res.status(200).json(statusArtigos);
});
router.get('/status-eventos', (req, res) => {
    const statusEventos = [
        { idstatusEvento: 1, descricao: 'Em Preparação' },
        { idstatusEvento: 2, descricao: 'Submissões Abertas' },
        { idstatusEvento: 3, descricao: 'Em Avaliação' },
        { idstatusEvento: 4, descricao: 'Finalizado' },
    ];
    return res.status(200).json(statusEventos);
});
router.get('/cargos', (req, res) => {
    const cargos = [
        { idcargo: 1, nome: 'Coordenador' },
        { idcargo: 2, nome: 'Avaliador' },
        { idcargo: 3, nome: 'Autor' },
    ];
    return res.status(200).json(cargos);
});
exports.default = router;
