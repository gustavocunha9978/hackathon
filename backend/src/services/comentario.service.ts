import prisma from '../config/database';

export interface CreateComentarioDTO {
  descricao: string;
  usuarioId: number;
  versaoArtigoId: number;
}

class ComentarioService {
  /**
   * Cria um novo comentário
   * @param comentarioData Dados do comentário
   * @returns Comentário criado
   */
  async createComentario(comentarioData: CreateComentarioDTO) {
    // Verifica se a versão do artigo existe
    const versaoArtigo = await prisma.versaoArtigo.findUnique({
      where: { idversao_artigo: comentarioData.versaoArtigoId },
    });

    if (!versaoArtigo) {
      throw new Error('Versão do artigo não encontrada');
    }

    // Cria o comentário
    const comentario = await prisma.comentario.create({
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
  async getComentariosByVersaoArtigo(versaoArtigoId: number) {
    // Verifica se a versão do artigo existe
    const versaoArtigo = await prisma.versaoArtigo.findUnique({
      where: { idversao_artigo: versaoArtigoId },
    });

    if (!versaoArtigo) {
      throw new Error('Versão do artigo não encontrada');
    }

    // Busca os comentários
    const comentarios = await prisma.comentario.findMany({
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

export default new ComentarioService();