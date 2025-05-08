"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class ComentarioService {
    /**
     * Cria um novo comentário
     * @param comentarioData Dados do comentário
     * @returns Comentário criado
     */
    async createComentario(comentarioData) {
        // Verifica se a versão do artigo existe
        const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
            where: { idversao_artigo: comentarioData.versaoArtigoId },
        });
        if (!versaoArtigo) {
            throw new Error('Versão do artigo não encontrada');
        }
        // Cria o comentário
        const comentario = await database_1.default.comentario.create({
            data: {
                descricao: comentarioData.descricao,
                usuario_idusuario: comentarioData.usuarioId,
                versao_artigo_idversao_artigo: comentarioData.versaoArtigoId,
            },
            include: {
                usuario: true,
            },
        });
        // Retorna o comentário criado
        return {
            idcomentario: comentario.idcomentario,
            descricao: comentario.descricao,
            versaoArtigoIdversaoArtigo: comentario.versao_artigo_idversao_artigo,
            usuarioIdusuario: comentario.usuario_idusuario,
            usuario: {
                nome: comentario.usuario.nome,
            },
        };
    }
    /**
     * Busca todos os comentários de uma versão de artigo
     * @param versaoArtigoId ID da versão do artigo
     * @returns Lista de comentários
     */
    async getComentariosByVersaoArtigo(versaoArtigoId) {
        // Verifica se a versão do artigo existe
        const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
            where: { idversao_artigo: versaoArtigoId },
        });
        if (!versaoArtigo) {
            throw new Error('Versão do artigo não encontrada');
        }
        // Busca os comentários
        const comentarios = await database_1.default.comentario.findMany({
            where: { versao_artigo_idversao_artigo: versaoArtigoId },
            include: {
                usuario: true,
            },
            orderBy: {
                idcomentario: 'asc',
            },
        });
        // Formata os dados dos comentários
        return comentarios.map((comentario) => ({
            idcomentario: comentario.idcomentario,
            descricao: comentario.descricao,
            versaoArtigoIdversaoArtigo: comentario.versao_artigo_idversao_artigo,
            usuarioIdusuario: comentario.usuario_idusuario,
            usuario: {
                nome: comentario.usuario.nome,
            },
        }));
    }
}
exports.default = new ComentarioService();
