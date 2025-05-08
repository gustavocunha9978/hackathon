import prisma from '../config/database';

export interface CreateArtigoDTO {
  titulo: string;
  resumo: string;
  areaTematica: string;
  eventoId: number;
  autoresIds: number[];
  palavrasChave: string[];
  caminhoPdf: string;
}

export interface UpdateArtigoDTO {
  titulo?: string;
  resumo?: string;
  areaTematica?: string;
  autoresIds?: number[];
  palavrasChave?: string[];
}

export interface ArtigoFilterDTO {
  evento?: number;
  areaTematica?: string;
  autor?: number;
  palavraChave?: string;
  status?: number;
}

class ArtigoService {
  /**
   * Cria um novo artigo
   * @param artigoData Dados do artigo
   * @returns Artigo criado
   */
  async createArtigo(artigoData: CreateArtigoDTO) {
    // Status inicial do artigo (1 - Em avaliação)
    const statusArtigoId = 1;

    // Cria o artigo
    const artigo = await prisma.artigo.create({
      data: {
        titulo: artigoData.titulo,
        resumo: artigoData.resumo,
        area_tematica: artigoData.areaTematica,
        status_artigo_idstatus_artigo: statusArtigoId,
      },
    });

    // Adiciona os autores
    await Promise.all(
      artigoData.autoresIds.map((autorId) =>
        prisma.autorArtigo.create({
          data: {
            usuario_idusuario: autorId,
            artigo_idartigo: artigo.idartigo,
          },
        })
      )
    );

    // Adiciona as palavras-chave
    await Promise.all(
      artigoData.palavrasChave.map((palavra) =>
        prisma.palavraArtigo.create({
          data: {
            nome: palavra,
            artigo_idartigo: artigo.idartigo,
          },
        })
      )
    );

    // Cria a primeira versão do artigo
    const dataAtual = new Date().toISOString();
    await prisma.versaoArtigo.create({
      data: {
        versao: "1.0",
        data_cadastro: dataAtual,
        caminho_pdf: artigoData.caminhoPdf,
        artigo_idartigo: artigo.idartigo,
      },
    });

    // Retorna o artigo completo
    return this.getArtigoById(artigo.idartigo);
  }

  /**
   * Busca um artigo pelo ID
   * @param artigoId ID do artigo
   * @returns Artigo encontrado
   */
  async getArtigoById(artigoId: number) {
    const artigo = await prisma.artigo.findUnique({
      where: { idartigo: artigoId },
      include: {
        status_artigo: true,
        autores: {
          include: {
            usuario: true,
          },
        },
        versoes: {
          include: {
            avaliacoes: {
              include: {
                usuario: true,
              },
            },
            comentarios: {
              include: {
                usuario: true,
              },
            },
            perguntas_artigo: {
              include: {
                pergunta: true,
              },
            },
          },
          orderBy: {
            idversao_artigo: 'desc',
          },
        },
        palavras_chave: true,
      },
    });

    if (!artigo) {
      throw new Error('Artigo não encontrado');
    }

    // Formata os dados do artigo
    return {
      idartigo: artigo.idartigo,
      titulo: artigo.titulo,
      resumo: artigo.resumo,
      areaTematica: artigo.area_tematica,
      statusArtigo: {
        id: artigo.status_artigo.idstatus_artigo,
        descricao: artigo.status_artigo.descricao,
      },
      versoes: artigo.versoes.map((versao) => ({
        idversaoArtigo: versao.idversao_artigo,
        versao: versao.versao,
        dataCadastro: versao.data_cadastro,
        caminhoPdf: versao.caminho_pdf,
        avaliacoes: versao.avaliacoes.map((avaliacao) => ({
          idavaliacao: avaliacao.idavaliacao,
          nota: avaliacao.nota,
          observacao: avaliacao.observacao,
          dataAvaliacao: avaliacao.data_avaliacao,
          avaliador: {
            id: avaliacao.usuario.idusuario,
            nome: avaliacao.usuario.nome,
          },
        })),
        comentarios: versao.comentarios.map((comentario) => ({
          idcomentario: comentario.idcomentario,
          descricao: comentario.descricao,
          usuario: {
            id: comentario.usuario.idusuario,
            nome: comentario.usuario.nome,
          },
        })),
        perguntas: versao.perguntas_artigo.map((pergunta) => ({
          idperguntaArtigo: pergunta.idpergunta_artigo,
          checked: pergunta.checked,
          pergunta: {
            idpergunta: pergunta.pergunta.idpergunta,
            descricao: pergunta.pergunta.descricao,
          },
        })),
      })),
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

  /**
   * Busca todos os artigos
   * @param filtros Filtros de busca
   * @returns Lista de artigos
   */
  async getAllArtigos(filtros?: ArtigoFilterDTO) {
    // Prepara os filtros
    const where: any = {};

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

    if (filtros?.status) {
      where.status_artigo_idstatus_artigo = filtros.status;
    }

    // Busca os artigos
    const artigos = await prisma.artigo.findMany({
      where,
      include: {
        status_artigo: true,
        autores: {
          include: {
            usuario: true,
          },
        },
        versoes: {
          orderBy: {
            idversao_artigo: 'desc',
          },
          take: 1, // Pega apenas a versão mais recente
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
      statusArtigo: {
        id: artigo.status_artigo.idstatus_artigo,
        descricao: artigo.status_artigo.descricao,
      },
      ultimaVersao: artigo.versoes.length > 0 ? {
        idversaoArtigo: artigo.versoes[0].idversao_artigo,
        versao: artigo.versoes[0].versao,
        dataCadastro: artigo.versoes[0].data_cadastro,
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
   * Busca os artigos de um autor
   * @param autorId ID do autor
   * @returns Lista de artigos do autor
   */
  async getArtigosByAutor(autorId: number) {
    const artigos = await prisma.artigo.findMany({
      where: {
        autores: {
          some: {
            usuario_idusuario: autorId,
          },
        },
      },
      include: {
        status_artigo: true,
        versoes: {
          orderBy: {
            idversao_artigo: 'desc',
          },
          take: 1,
          include: {
            avaliacoes: {
              select: {
                idavaliacao: true,
                nota: true,
                observacao: true,
                data_avaliacao: true,
              },
            },
          },
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
      statusArtigo: {
        id: artigo.status_artigo.idstatus_artigo,
        descricao: artigo.status_artigo.descricao,
      },
      ultimaVersao: artigo.versoes.length > 0 ? {
        idversaoArtigo: artigo.versoes[0].idversao_artigo,
        versao: artigo.versoes[0].versao,
        dataCadastro: artigo.versoes[0].data_cadastro,
        avaliacoes: artigo.versoes[0].avaliacoes.map((avaliacao) => ({
          idavaliacao: avaliacao.idavaliacao,
          nota: avaliacao.nota,
          observacao: avaliacao.observacao,
          dataAvaliacao: avaliacao.data_avaliacao,
        })),
      } : null,
      palavrasChave: artigo.palavras_chave.map((palavra) => ({
        idpalavraArtigo: palavra.idpalavra_artigo,
        nome: palavra.nome,
      })),
    }));
  }

  /**
   * Busca os artigos para avaliação de um avaliador
   * @param avaliadorId ID do avaliador
   * @returns Lista de artigos para avaliação
   */
  async getArtigosParaAvaliacao(avaliadorId: number) {
    // Busca os eventos em que o usuário é avaliador
    const eventosAvaliador = await prisma.eventoAvaliador.findMany({
      where: {
        usuario_idusuario: avaliadorId,
      },
      include: {
        evento: true,
      },
    });

    const eventosIds = eventosAvaliador.map((ea) => ea.evento_idevento);

    // Busca artigos que estão em eventos para os quais o usuário é avaliador
    // e que ainda não foram avaliados por ele
    const artigos = await prisma.artigo.findMany({
      where: {
        AND: [
          {
            // Artigo com status "Em avaliação" (1)
            status_artigo_idstatus_artigo: 1,
          },
          {
            // Artigo que não foi avaliado pelo avaliador
            versoes: {
              some: {
                avaliacoes: {
                  none: {
                    usuario_idusuario: avaliadorId,
                  },
                },
              },
            },
          },
        ],
      },
      include: {
        status_artigo: true,
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
      statusArtigo: {
        id: artigo.status_artigo.idstatus_artigo,
        descricao: artigo.status_artigo.descricao,
      },
      ultimaVersao: artigo.versoes.length > 0 ? {
        idversaoArtigo: artigo.versoes[0].idversao_artigo,
        versao: artigo.versoes[0].versao,
        dataCadastro: artigo.versoes[0].data_cadastro,
      } : null,
      palavrasChave: artigo.palavras_chave.map((palavra) => ({
        idpalavraArtigo: palavra.idpalavra_artigo,
        nome: palavra.nome,
      })),
    }));
  }

  /**
   * Atualiza o status de um artigo
   * @param artigoId ID do artigo
   * @param statusId ID do status
   * @returns Artigo atualizado
   */
  async updateStatusArtigo(artigoId: number, statusId: number) {
    // Verifica se o artigo existe
    const artigoExistente = await prisma.artigo.findUnique({
      where: { idartigo: artigoId },
    });

    if (!artigoExistente) {
      throw new Error('Artigo não encontrado');
    }

    // Verifica se o status existe
    const statusExistente = await prisma.statusArtigo.findUnique({
      where: { idstatus_artigo: statusId },
    });

    if (!statusExistente) {
      throw new Error('Status de artigo não encontrado');
    }

    // Atualiza o status do artigo
    await prisma.artigo.update({
      where: { idartigo: artigoId },
      data: {
        status_artigo_idstatus_artigo: statusId,
      },
    });

    return {
      idartigo: artigoId,
      statusArtigo: {
        id: statusId,
        descricao: statusExistente.descricao,
      },
    };
  }

  /**
   * Envia uma nova versão do artigo
   * @param artigoId ID do artigo
   * @param caminhoPdf Caminho do PDF
   * @returns Nova versão do artigo
   */
  async enviarNovaVersao(artigoId: number, caminhoPdf: string) {
    // Verifica se o artigo existe
    const artigo = await prisma.artigo.findUnique({
      where: { idartigo: artigoId },
      include: {
        versoes: {
          orderBy: {
            idversao_artigo: 'desc',
          },
          take: 1,
        },
      },
    });

    if (!artigo) {
      throw new Error('Artigo não encontrado');
    }

    // Verifica se o artigo está em status que permite nova versão (2 - Em Revisão)
    if (artigo.status_artigo_idstatus_artigo !== 2) {
      throw new Error('O artigo não está em status que permite envio de nova versão');
    }

    // Calcula o número da nova versão
    let novoNumeroVersao = "1.0";
    if (artigo.versoes.length > 0) {
      const versaoAtual = artigo.versoes[0].versao;
      const partes = versaoAtual.split('.');
      if (partes.length === 2) {
        const major = parseInt(partes[0]);
        const minor = parseInt(partes[1]) + 1;
        novoNumeroVersao = `${major}.${minor}`;
      }
    }

    // Cria a nova versão
    const dataAtual = new Date().toISOString();
    const novaVersao = await prisma.versaoArtigo.create({
      data: {
        versao: novoNumeroVersao,
        data_cadastro: dataAtual,
        caminho_pdf: caminhoPdf,
        artigo_idartigo: artigoId,
      },
    });

    // Atualiza o status do artigo para "Em avaliação" (1)
    await this.updateStatusArtigo(artigoId, 1);

    return {
      idversaoArtigo: novaVersao.idversao_artigo,
      versao: novaVersao.versao,
      dataCadastro: novaVersao.data_cadastro,
      caminhoPdf: novaVersao.caminho_pdf,
      artigoIdartigo: novaVersao.artigo_idartigo,
    };
  }

  /**
   * Atualiza um artigo
   * @param artigoId ID do artigo
   * @param artigoData Dados do artigo
   * @returns Artigo atualizado
   */
  async updateArtigo(artigoId: number, artigoData: UpdateArtigoDTO) {
    // Verifica se o artigo existe
    const artigoExistente = await prisma.artigo.findUnique({
      where: { idartigo: artigoId },
    });

    if (!artigoExistente) {
      throw new Error('Artigo não encontrado');
    }

    // Prepara os dados para atualização
    const dadosAtualizacao: any = {};

    if (artigoData.titulo) {
      dadosAtualizacao.titulo = artigoData.titulo;
    }

    if (artigoData.resumo) {
      dadosAtualizacao.resumo = artigoData.resumo;
    }

    if (artigoData.areaTematica) {
      dadosAtualizacao.area_tematica = artigoData.areaTematica;
    }

    // Atualiza o artigo
    await prisma.artigo.update({
      where: { idartigo: artigoId },
      data: dadosAtualizacao,
    });

    // Se houver autores, atualiza os autores do artigo
    if (artigoData.autoresIds) {
      // Remove todos os autores atuais
      await prisma.autorArtigo.deleteMany({
        where: { artigo_idartigo: artigoId },
      });

      // Adiciona os novos autores
      if (artigoData.autoresIds.length > 0) {
        await Promise.all(
          artigoData.autoresIds.map((autorId) =>
            prisma.autorArtigo.create({
              data: {
                usuario_idusuario: autorId,
                artigo_idartigo: artigoId,
              },
            })
          )
        );
      }
    }

    // Se houver palavras-chave, atualiza as palavras-chave do artigo
    if (artigoData.palavrasChave) {
      // Remove todas as palavras-chave atuais
      await prisma.palavraArtigo.deleteMany({
        where: { artigo_idartigo: artigoId },
      });

      // Adiciona as novas palavras-chave
      if (artigoData.palavrasChave.length > 0) {
        await Promise.all(
          artigoData.palavrasChave.map((palavra) =>
            prisma.palavraArtigo.create({
              data: {
                nome: palavra,
                artigo_idartigo: artigoId,
              },
            })
          )
        );
      }
    }

    // Retorna o artigo atualizado
    return this.getArtigoById(artigoId);
  }

  /**
   * Busca todos os status de artigo
   * @returns Lista de status de artigo
   */
  async getAllStatusArtigo() {
    const statusArtigos = await prisma.statusArtigo.findMany();
    return statusArtigos.map((status) => ({
      idstatusArtigo: status.idstatus_artigo,
      descricao: status.descricao,
    }));
  }
}

export default new ArtigoService();