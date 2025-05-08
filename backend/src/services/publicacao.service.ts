import prisma from '../config/database';
import { ArtigoFilterDTO } from './artigo.service';

class PublicacaoService {
  /**
   * Busca todos os artigos aprovados
   * @param filtros Filtros de busca
   * @returns Lista de artigos aprovados
   */
  async getAllArtigosAprovados(filtros?: ArtigoFilterDTO) {
    // Prepara os filtros
    const where: any = {
      // Artigos com status "Aprovado" (3)
      status_artigo_idstatus_artigo: 3,
    };

    if (filtros?.evento) {
      where.versoes = {
        some: {
          evento_idevento: filtros.evento,
        },
      };
    }

    if (filtros?.areaTematica) {
      where.area_tematica = filtros.areaTematica;
    }

    if (filtros?.autor) {
      where.autores = {
        some: {
          usuario_idusuario: filtros.autor,
        },
      };
    }

    if (filtros?.palavraChave) {
      where.palavras_chave = {
        some: {
          nome: {
            contains: filtros.palavraChave,
            mode: 'insensitive',
          },
        },
      };
    }

    // Busca os artigos
    const artigos = await prisma.artigo.findMany({
      where,
      include: {
        autores: {
          include: {
            usuario: true,
          },
        },
        versoes: {
          orderBy: {
            idversao_artigo: 'desc',
          },
          take: 1,
        },
        palavras_chave: true,
      },
    });

    // Formata os dados dos artigos
    return artigos.map((artigo) => ({
      idartigo: artigo.idartigo,
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      areaTematica: artigo.area_tematica,
      ultimaVersao: artigo.versoes.length > 0 ? {
        idversaoArtigo: artigo.versoes[0].idversao_artigo,
        versao: artigo.versoes[0].versao,
        dataCadastro: artigo.versoes[0].data_cadastro,
        caminhoPdf: artigo.versoes[0].caminho_pdf,
      } : null,
      autores: artigo.autores.map((autor) => ({
        usuario: {
          idusuario: autor.usuario.idusuario,
          nome: autor.usuario.nome,
        },
      })),
      palavrasChave: artigo.palavras_chave.map((palavra) => ({
        idpalavraArtigo: palavra.idpalavra_artigo,
        nome: palavra.nome,
      })),
    }));
  }

  /**
   * Busca um artigo aprovado pelo ID
   * @param artigoId ID do artigo
   * @returns Artigo aprovado
   */
  async getArtigoAprovadoById(artigoId: number) {
    const artigo = await prisma.artigo.findFirst({
      where: {
        idartigo: artigoId,
        status_artigo_idstatus_artigo: 3, // Status "Aprovado"
      },
      include: {
        autores: {
          include: {
            usuario: true,
          },
        },
        versoes: {
          orderBy: {
            idversao_artigo: 'desc',
          },
          take: 1,
        },
        palavras_chave: true,
      },
    });

    if (!artigo) {
      throw new Error('Artigo não encontrado ou não está aprovado');
    }

    // Formata os dados do artigo
    return {
      idartigo: artigo.idartigo,
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      areaTematica: artigo.area_tematica,
      ultimaVersao: artigo.versoes.length > 0 ? {
        idversaoArtigo: artigo.versoes[0].idversao_artigo,
        versao: artigo.versoes[0].versao,
        dataCadastro: artigo.versoes[0].data_cadastro,
        caminhoPdf: artigo.versoes[0].caminho_pdf,
      } : null,
      autores: artigo.autores.map((autor) => ({
        usuario: {
          idusuario: autor.usuario.idusuario,
          nome: autor.usuario.nome,
        },
      })),
      palavrasChave: artigo.palavras_chave.map((palavra) => ({
        idpalavraArtigo: palavra.idpalavra_artigo,
        nome: palavra.nome,
      })),
    };
  }
}

export default new PublicacaoService();