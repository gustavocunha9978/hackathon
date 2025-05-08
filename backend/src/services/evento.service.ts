import prisma from '../config/database';

export interface CreateEventoDTO {
  nome: string;
  banner: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  tipoAvaliacao?: number;
  instituicaoId: number;
}

export interface UpdateEventoDTO {
  nome?: string;
  banner?: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  tipoAvaliacao?: number;
}

export interface EventoFilterDTO {
  status?: number;
  dataInicio?: string;
  dataFim?: string;
}

export interface AvaliadoresEventoDTO {
  avaliadoresIds: number[];
}

class EventoService {
  /**
   * Cria um novo evento
   * @param eventoData Dados do evento
   * @returns Evento criado
   */
  async createEvento(eventoData: CreateEventoDTO) {
    // Verifica se a data de início é anterior à data de fim
    if (new Date(eventoData.dataInicio) >= new Date(eventoData.dataFim)) {
      throw new Error('A data de início deve ser anterior à data de fim');
    }

    // Cria o evento
    const evento = await prisma.evento.create({
      data: {
        nome: eventoData.nome,
        banner: eventoData.banner,
        descricao: eventoData.descricao,
        data_inicio: eventoData.dataInicio,
        data_fim: eventoData.dataFim,
        tipoavalicao_idtipo_avalicao: eventoData.tipoAvaliacao || 1, // Valor padrão 1 se não for fornecido
        instituicao_idinstituicao: eventoData.instituicaoId
      },
    });

    // Retorna o evento
    return this.getEventoById(evento.idevento);
  }

  /**
   * Adiciona avaliadores a um evento
   * @param eventoId ID do evento
   * @param avaliadoresData IDs dos avaliadores
   * @returns Evento atualizado com os avaliadores
   */
  async addAvaliadoresEvento(eventoId: number, avaliadoresData: AvaliadoresEventoDTO) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Para cada avaliador, verifica se já está vinculado ao evento
    const avaliadoresPromises = avaliadoresData.avaliadoresIds.map(async (avaliadorId) => {
      const avaliadorExistente = await prisma.eventoAvaliador.findFirst({
        where: {
          evento_idevento: eventoId,
          usuario_idusuario: avaliadorId,
        },
      });

      // Se o avaliador já estiver vinculado, pula
      if (!avaliadorExistente) {
        // Verifica se o usuário existe
        const usuarioExistente = await prisma.usuario.findUnique({
          where: { idusuario: avaliadorId },
        });

        if (!usuarioExistente) {
          throw new Error(`Usuário com ID ${avaliadorId} não encontrado`);
        }

        // Verifica se o usuário tem cargo de avaliador (2) ou coordenador (1)
        const temCargoAvaliador = await prisma.cargoUsuario.findFirst({
          where: {
            usuario_idusuario: avaliadorId,
            OR: [
              { cargo_idcargo: 1 }, // Coordenador
              { cargo_idcargo: 2 }, // Avaliador
            ],
          },
        });

        if (!temCargoAvaliador) {
          throw new Error(`Usuário com ID ${avaliadorId} não tem permissão de avaliador`);
        }

        // Adiciona o avaliador ao evento
        return prisma.eventoAvaliador.create({
          data: {
            evento_idevento: eventoId,
            usuario_idusuario: avaliadorId,
          },
        });
      }
    });

    await Promise.all(avaliadoresPromises);

    // Retorna o evento atualizado
    return this.getEventoById(eventoId);
  }

  /**
   * Remove avaliadores de um evento
   * @param eventoId ID do evento
   * @param avaliadoresData IDs dos avaliadores
   * @returns Evento atualizado sem os avaliadores
   */
  async removeAvaliadoresEvento(eventoId: number, avaliadoresData: AvaliadoresEventoDTO) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Remove cada avaliador do evento
    const avaliadoresPromises = avaliadoresData.avaliadoresIds.map(async (avaliadorId) => {
      return prisma.eventoAvaliador.deleteMany({
        where: {
          evento_idevento: eventoId,
          usuario_idusuario: avaliadorId,
        },
      });
    });

    await Promise.all(avaliadoresPromises);

    // Retorna o evento atualizado
    return this.getEventoById(eventoId);
  }

  /**
   * Obtém os avaliadores de um evento
   * @param eventoId ID do evento
   * @returns Lista de avaliadores do evento
   */
  async getAvaliadoresEvento(eventoId: number) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Busca os avaliadores do evento
    const avaliadores = await prisma.eventoAvaliador.findMany({
      where: { evento_idevento: eventoId },
      include: {
        usuario: true,
      },
    });

    // Formata os dados dos avaliadores
    return avaliadores.map((avaliador) => ({
      idusuario: avaliador.usuario_idusuario,
      nome: avaliador.usuario.nome,
      email: avaliador.usuario.email,
    }));
  }

  /**
   * Busca um evento pelo ID
   * @param eventoId ID do evento
   * @returns Evento encontrado
   */
  async getEventoById(eventoId: number) {
    const evento = await prisma.evento.findUnique({
      where: { idevento: eventoId },
      include: {
        avaliadores: {
          include: {
            usuario: true,
          },
        },
        tipoavalicao: true,
        checklists: {
          include: {
            perguntas: true,
          },
        },
      },
    });

    if (!evento) {
      throw new Error('Evento não encontrado');
    }

    // Formata os dados do evento
    return {
      idevento: evento.idevento,
      nome: evento.nome,
      banner: evento.banner,
      descricao: evento.descricao,
      dataInicio: evento.data_inicio,
      dataFim: evento.data_fim,
      tipoavalicao_idtipo_avalicao: evento.tipoavalicao_idtipo_avalicao,
      instituicao_idinstituicao: evento.instituicao_idinstituicao,
      avaliadores: evento.avaliadores.map((avaliador) => ({
        usuarioIdusuario: avaliador.usuario_idusuario,
        nome: avaliador.usuario.nome,
      })),
      tipoAvaliacao: {
        idAvaliacao: evento.tipoavalicao.idtipo_avalicao,
        nomeAvaliacao: evento.tipoavalicao.nome,
      },
      checklists: evento.checklists.map((checklist) => ({
        idchecklistEvento: checklist.idchecklist_evento,
        perguntas: checklist.perguntas.map((pergunta) => ({
          idpergunta: pergunta.idpergunta,
          descricao: pergunta.descricao,
        })),
      })),
    };
  }

  /**
   * Busca todos os eventos
   * @param filtros Filtros de busca
   * @returns Lista de eventos
   */
  async getAllEventos(filtros?: EventoFilterDTO) {
    // Prepara os filtros
    const where: any = {};

    if (filtros?.dataInicio) {
      where.data_inicio = {
        gte: filtros.dataInicio,
      };
    }

    if (filtros?.dataFim) {
      where.data_fim = {
        lte: filtros.dataFim,
      };
    }

    // Busca os eventos
    const eventos = await prisma.evento.findMany({
      where,
      include: {
        avaliadores: {
          include: {
            usuario: true,
          },
        },
        tipoavalicao: true,
      },
    });

    // Formata os dados dos eventos
    return eventos.map((evento) => {
      // Lógica para determinar o status do evento
      const currentDate = new Date();
      let status = 'planejado'; // Status padrão (planejado)

      if (new Date(evento.data_inicio) <= currentDate && new Date(evento.data_fim) >= currentDate) {
        status = 'ativo'; // Se a data de início passou e a data de fim não chegou, é 'ativo'
      } else if (new Date(evento.data_fim) < currentDate) {
        status = 'finalizado'; // Se a data de fim já passou, é 'finalizado'
      }

      return {
        idevento: evento.idevento,
        nome: evento.nome,
        banner: evento.banner,
        descricao: evento.descricao,
        dataInicio: evento.data_inicio,
        dataFim: evento.data_fim,
        status: status, // Status determinado pela lógica
        tipoavalicao_idtipo_avalicao: evento.tipoavalicao_idtipo_avalicao,
        tipoAvaliacao: {
          idAvaliacao: evento.tipoavalicao.idtipo_avalicao,
          nomeAvaliacao: evento.tipoavalicao.nome,
        },
        instituicao_idinstituicao: evento.instituicao_idinstituicao,
        avaliadores: evento.avaliadores.map((avaliador) => ({
          usuarioIdusuario: avaliador.usuario_idusuario,
          nome: avaliador.usuario.nome,
        })),
      };
    });
  }
  
  /**
   * Atualiza um evento
   * @param eventoId ID do evento
   * @param eventoData Dados do evento
   * @returns Evento atualizado
   */
  async updateEvento(eventoId: number, eventoData: UpdateEventoDTO) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Se houver data de início e data de fim, verifica se a data de início é anterior à data de fim
    if (eventoData.dataInicio && eventoData.dataFim) {
      if (new Date(eventoData.dataInicio) >= new Date(eventoData.dataFim)) {
        throw new Error('A data de início deve ser anterior à data de fim');
      }
    } else if (eventoData.dataInicio && !eventoData.dataFim) {
      // Se houver apenas data de início, verifica com a data de fim existente
      if (new Date(eventoData.dataInicio) >= new Date(eventoExistente.data_fim)) {
        throw new Error('A data de início deve ser anterior à data de fim');
      }
    } else if (!eventoData.dataInicio && eventoData.dataFim) {
      // Se houver apenas data de fim, verifica com a data de início existente
      if (new Date(eventoExistente.data_inicio) >= new Date(eventoData.dataFim)) {
        throw new Error('A data de início deve ser anterior à data de fim');
      }
    }

    // Prepara os dados para atualização
    const dadosAtualizacao: any = {};

    if (eventoData.nome) {
      dadosAtualizacao.nome = eventoData.nome;
    }

    if (eventoData.banner) {
      dadosAtualizacao.banner = eventoData.banner;
    }

    if (eventoData.descricao) {
      dadosAtualizacao.descricao = eventoData.descricao;
    }

    if (eventoData.dataInicio) {
      dadosAtualizacao.data_inicio = eventoData.dataInicio;
    }

    if (eventoData.dataFim) {
      dadosAtualizacao.data_fim = eventoData.dataFim;
    }

    if (eventoData.tipoAvaliacao) {
      dadosAtualizacao.tipoavalicao_idtipo_avalicao = eventoData.tipoAvaliacao;
    }

    // Atualiza o evento
    await prisma.evento.update({
      where: { idevento: eventoId },
      data: dadosAtualizacao,
    });

    // Retorna o evento atualizado
    return this.getEventoById(eventoId);
  }

  /**
   * Exclui um evento
   * @param eventoId ID do evento
   */
  async deleteEvento(eventoId: number) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Exclui as relações do evento
    await prisma.$transaction([
      // Exclui os avaliadores do evento
      prisma.eventoAvaliador.deleteMany({
        where: { evento_idevento: eventoId },
      }),
      // Exclui as perguntas dos checklists do evento
      prisma.pergunta.deleteMany({
        where: {
          checklist_evento: {
            evento_idevento: eventoId,
          },
        },
      }),
      // Exclui os checklists do evento
      prisma.checklistEvento.deleteMany({
        where: { evento_idevento: eventoId },
      }),
      // Exclui o evento
      prisma.evento.delete({
        where: { idevento: eventoId },
      }),
    ]);

    return { success: true };
  }

  /**
   * Cria um checklist para um evento
   * @param eventoId ID do evento
   * @param perguntas Perguntas do checklist
   * @returns Checklist criado
   */
  async createChecklist(eventoId: number, perguntas: { descricao: string }[]) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Cria o checklist
    const checklist = await prisma.checklistEvento.create({
      data: {
        evento_idevento: eventoId,
      },
    });

    // Cria as perguntas do checklist
    const perguntasPromises = perguntas.map((pergunta) =>
      prisma.pergunta.create({
        data: {
          descricao: pergunta.descricao,
          checklist_evento_idchecklist_evento: checklist.idchecklist_evento,
        },
      })
    );

    const perguntasCriadas = await Promise.all(perguntasPromises);

    // Retorna o checklist com suas perguntas
    return {
      idchecklistEvento: checklist.idchecklist_evento,
      eventoIdevento: checklist.evento_idevento,
      perguntas: perguntasCriadas.map((pergunta) => ({
        idpergunta: pergunta.idpergunta,
        descricao: pergunta.descricao,
      })),
    };
  }
}

export default new EventoService();