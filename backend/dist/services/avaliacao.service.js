"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
const artigo_service_1 = __importDefault(require("./artigo.service"));
class AvaliacaoService {
    /**
     * Cria uma nova avaliação
     * @param avaliacaoData Dados da avaliação
     * @returns Avaliação criada
     */
    async createAvaliacao(avaliacaoData) {
        // Verifica se a versão do artigo existe
        const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
            where: { idversao_artigo: avaliacaoData.versaoArtigoId },
            include: {
                artigo: true,
            },
        });
        if (!versaoArtigo) {
            throw new Error('Versão do artigo não encontrada');
        }
        // Verifica se o usuário já avaliou esta versão
        const avaliacaoExistente = await database_1.default.avaliacao.findFirst({
            where: {
                usuario_idusuario: avaliacaoData.usuarioId,
                versao_artigo_idversao_artigo: avaliacaoData.versaoArtigoId,
            },
        });
        if (avaliacaoExistente) {
            throw new Error('Você já avaliou esta versão do artigo');
        }
        // Cria a avaliação
        const dataAtual = new Date().toISOString();
        const avaliacao = await database_1.default.avaliacao.create({
            data: {
                nota: avaliacaoData.nota,
                observacao: avaliacaoData.observacao,
                data_avaliacao: dataAtual,
                caminho_pdf: avaliacaoData.avaliacaoPdf,
                usuario_idusuario: avaliacaoData.usuarioId,
                versao_artigo_idversao_artigo: avaliacaoData.versaoArtigoId,
            },
            include: {
                usuario: true,
                versao_artigo: {
                    include: {
                        artigo: true,
                    },
                },
            },
        });
        // Após a avaliação, verifica se todas as avaliações foram concluídas
        // e atualiza o status do artigo conforme necessário
        await this.processarStatusAposAvaliacao(versaoArtigo.artigo_idartigo);
        // Retorna a avaliação criada
        return {
            idavaliacao: avaliacao.idavaliacao,
            nota: avaliacao.nota,
            observacao: avaliacao.observacao,
            dataAvaliacao: avaliacao.data_avaliacao,
            caminhoPdf: avaliacao.caminho_pdf,
            usuarioIdusuario: avaliacao.usuario_idusuario,
            versaoArtigoIdversaoArtigo: avaliacao.versao_artigo_idversao_artigo,
            usuario: {
                nome: avaliacao.usuario.nome,
            },
        };
    }
    /**
     * Processa o status do artigo após uma avaliação
     * @param artigoId ID do artigo
     */
    async processarStatusAposAvaliacao(artigoId) {
        // Busca o artigo com todas as avaliações da última versão
        const artigo = await database_1.default.artigo.findUnique({
            where: { idartigo: artigoId },
            include: {
                versoes: {
                    orderBy: {
                        idversao_artigo: 'desc',
                    },
                    take: 1,
                    include: {
                        avaliacoes: true,
                    },
                },
            },
        });
        if (!artigo || artigo.versoes.length === 0) {
            return;
        }
        const ultimaVersao = artigo.versoes[0];
        const avaliacoes = ultimaVersao.avaliacoes;
        // Se não houver avaliações, não faz nada
        if (avaliacoes.length === 0) {
            return;
        }
        // Conta as avaliações por categoria
        let aprovacoes = 0;
        let reprovacoes = 0;
        let revisoes = 0;
        for (const avaliacao of avaliacoes) {
            if (avaliacao.nota === 'Aprovado') {
                aprovacoes++;
            }
            else if (avaliacao.nota === 'Reprovado') {
                reprovacoes++;
            }
            else if (avaliacao.nota === 'Revisão') {
                revisoes++;
            }
        }
        // Define o novo status com base nas avaliações
        let novoStatusId;
        if (reprovacoes === avaliacoes.length) {
            // 100% de reprovação: Status "Reprovado" (4)
            novoStatusId = 4;
        }
        else if (aprovacoes === avaliacoes.length) {
            // 100% de aprovação: Status "Aprovado" (3)
            novoStatusId = 3;
        }
        else if (revisoes > 0 || (aprovacoes > 0 && reprovacoes > 0)) {
            // Revisões ou mistura de aprovações e reprovações: Status "Em Revisão" (2)
            novoStatusId = 2;
        }
        else {
            // Mantém o status atual
            return;
        }
        // Atualiza o status do artigo
        await artigo_service_1.default.updateStatusArtigo(artigoId, novoStatusId);
    }
    /**
     * Busca todas as avaliações de um artigo
     * @param artigoId ID do artigo
     * @returns Lista de avaliações do artigo
     */
    async getAvaliacoesByArtigo(artigoId) {
        // Verifica se o artigo existe
        const artigo = await database_1.default.artigo.findUnique({
            where: { idartigo: artigoId },
            include: {
                versoes: {
                    include: {
                        avaliacoes: {
                            include: {
                                usuario: true,
                            },
                        },
                    },
                    orderBy: {
                        idversao_artigo: 'desc',
                    },
                },
            },
        });
        if (!artigo) {
            throw new Error('Artigo não encontrado');
        }
        // Formata os dados das avaliações
        const avaliacoes = [];
        for (const versao of artigo.versoes) {
            for (const avaliacao of versao.avaliacoes) {
                avaliacoes.push({
                    idavaliacao: avaliacao.idavaliacao,
                    nota: avaliacao.nota,
                    observacao: avaliacao.observacao,
                    dataAvaliacao: avaliacao.data_avaliacao,
                    caminhoPdf: avaliacao.caminho_pdf,
                    versao: {
                        idversaoArtigo: versao.idversao_artigo,
                        versao: versao.versao,
                    },
                    avaliador: {
                        id: avaliacao.usuario.idusuario,
                        nome: avaliacao.usuario.nome,
                    },
                });
            }
        }
        return avaliacoes;
    }
    /**
     * Responde às perguntas do checklist para uma versão do artigo
     * @param versaoArtigoId ID da versão do artigo
     * @param perguntas Respostas às perguntas
     * @returns Lista de respostas
     */
    async responderChecklist(versaoArtigoId, perguntas) {
        // Verifica se a versão do artigo existe
        const versaoArtigo = await database_1.default.versaoArtigo.findUnique({
            where: { idversao_artigo: versaoArtigoId },
        });
        if (!versaoArtigo) {
            throw new Error('Versão do artigo não encontrada');
        }
        // Cria as respostas às perguntas
        const respostasPromises = perguntas.map((pergunta) => database_1.default.perguntaArtigo.create({
            data: {
                checked: pergunta.checked ? 'Sim' : 'Não',
                pergunta_idpergunta: pergunta.perguntaIdpergunta,
                versao_artigo_idversao_artigo: versaoArtigoId,
            },
            include: {
                pergunta: true,
            },
        }));
        const respostas = await Promise.all(respostasPromises);
        // Formata os dados das respostas
        return respostas.map((resposta) => ({
            idperguntaArtigo: resposta.idpergunta_artigo,
            checked: resposta.checked,
            pergunta: {
                idpergunta: resposta.pergunta.idpergunta,
                descricao: resposta.pergunta.descricao,
            },
        }));
    }
}
exports.default = new AvaliacaoService();
