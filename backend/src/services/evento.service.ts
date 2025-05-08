import prisma from '../config/database';

export interface CreateEventoDTO {
  nome: string;
  banner: string;
  descricao: string;
  dataInicio: string;
  dataFim: string;
  statusEventoId: number;
  avaliadoresIds?: number[];
  tipoAvaliacao?: number[];
}

export interface UpdateEventoDTO {
  nome?: string;
  banner?: string;
  descricao?: string;
  dataInicio?: string;
  dataFim?: string;
  statusEventoId?: number;
  avaliadoresIds?: number[];
  tipoAvaliacao?: number[];
}

export interface EventoFilterDTO {
  status?: number;
  dataInicio?: string;
  dataFim?: string;
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
        status_evento_idstatus_evento: eventoData.statusEventoId,
      },
    });

    // Se houver avaliadores, associa-os ao evento
    if (eventoData.avaliadoresIds && eventoData.avaliadoresIds.length > 0) {
      await Promise.all(
        eventoData.avaliadoresIds.map((avaliadorId) =>
          prisma.eventoAvaliador.create({
            data: {
              evento_idevento: evento.idevento,
              usuario_idusuario: avaliadorId,
            },
          })
        )
      );
    }

    // Se houver tipos de avaliação, cria-os
    if (eventoData.tipoAvaliacao && eventoData.tipoAvaliacao.length > 0) {
      await Promise.all(
        eventoData.tipoAvaliacao.map((tipoId) =>
          prisma.tipoAvalicao.create({
            data: {
              nome: `Tipo ${tipoId}`, // Nome temporário, seria melhor receber o nome do tipo
              evento_idevento: evento.idevento,
            },
          })
        )
      );
    }

    // Retorna o evento com seus avaliadores
    return this.getEventoById(evento.idevento);
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
        status_evento: true,
        avaliadores: {
          include: {
            usuario: true,
          },
        },
        tipo_avaliacoes: true,
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
      statusEvento: {
        idstatusEvento: evento.status_evento.idstatus_evento,
        descricao: evento.status_evento.descricao,
      },
      avaliadores: evento.avaliadores.map((avaliador) => ({
        usuarioIdusuario: avaliador.usuario_idusuario,
        nome: avaliador.usuario.nome,
      })),
      tipoAvaliacao: evento.tipo_avaliacoes.map((tipo) => ({
        idAvaliacao: tipo.idtipo_avalicao,
        nomeAvaliacao: tipo.nome,
      })),
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

    if (filtros?.status) {
      where.status_evento_idstatus_evento = filtros.status;
    }

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
        status_evento: true,
        avaliadores: {
          include: {
            usuario: true,
          },
        },
      },
    });

    // Formata os dados dos eventos
    return eventos.map((evento) => ({
      idevento: evento.idevento,
      nome: evento.nome,
      banner: evento.banner,
      descricao: evento.descricao,
      dataInicio: evento.data_inicio,
      dataFim: evento.data_fim,
      statusEvento: {
        idstatusEvento: evento.status_evento.idstatus_evento,
        descricao: evento.status_evento.descricao,
      },
      avaliadores: evento.avaliadores.map((avaliador) => ({
        usuarioIdusuario: avaliador.usuario_idusuario,
        nome: avaliador.usuario.nome,
      })),
    }));
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

    if (eventoData.statusEventoId) {
      dadosAtualizacao.status_evento_idstatus_evento = eventoData.statusEventoId;
    }

    // Atualiza o evento
    await prisma.evento.update({
      where: { idevento: eventoId },
      data: dadosAtualizacao,
    });

    // Se houver avaliadores, atualiza os avaliadores do evento
    if (eventoData.avaliadoresIds) {
      // Remove todos os avaliadores atuais
      await prisma.eventoAvaliador.deleteMany({
        where: { evento_idevento: eventoId },
      });

      // Adiciona os novos avaliadores
      if (eventoData.avaliadoresIds.length > 0) {
        await Promise.all(
          eventoData.avaliadoresIds.map((avaliadorId) =>
            prisma.eventoAvaliador.create({
              data: {
                evento_idevento: eventoId,
                usuario_idusuario: avaliadorId,
              },
            })
          )
        );
      }
    }

    // Se houver tipos de avaliação, atualiza os tipos de avaliação do evento
    if (eventoData.tipoAvaliacao) {
      // Remove todos os tipos de avaliação atuais
      await prisma.tipoAvalicao.deleteMany({
        where: { evento_idevento: eventoId },
      });

      // Adiciona os novos tipos de avaliação
      if (eventoData.tipoAvaliacao.length > 0) {
        await Promise.all(
          eventoData.tipoAvaliacao.map((tipoId) =>
            prisma.tipoAvalicao.create({
              data: {
                nome: `Tipo ${tipoId}`, // Nome temporário
                evento_idevento: eventoId,
              },
            })
          )
        );
      }
    }

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
      // Exclui os tipos de avaliação do evento
      prisma.tipoAvalicao.deleteMany({
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

  /**
   * Busca todos os status de evento
   * @returns Lista de status de evento
   */
  async getAllStatusEvento() {
    const statusEventos = await prisma.statusEvento.findMany();
    return statusEventos.map((status) => ({
      idstatusEvento: status.idstatus_evento,
      descricao: status.descricao,
    }));
  }
}

export default new EventoService();