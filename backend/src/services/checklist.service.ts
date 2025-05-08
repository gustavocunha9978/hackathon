import prisma from '../config/database';

export interface CreateChecklistDTO {
  eventoId: number;
  perguntas: { descricao: string }[];
}

export interface UpdateChecklistDTO {
  perguntas?: { descricao: string }[];
}

export interface AddPerguntaDTO {
  descricao: string;
  checklistId: number;
}

export interface UpdatePerguntaDTO {
  descricao: string;
}

class ChecklistService {
  /**
   * Cria um checklist para um evento
   * @param checklistData Dados do checklist
   * @returns Checklist criado
   */
  async createChecklist(checklistData: CreateChecklistDTO) {
    // Verifica se o evento existe
    const eventoExistente = await prisma.evento.findUnique({
      where: { idevento: checklistData.eventoId },
    });

    if (!eventoExistente) {
      throw new Error('Evento não encontrado');
    }

    // Verifica se o evento já possui um checklist
    const checklistExistente = await prisma.checklistEvento.findFirst({
      where: { evento_idevento: checklistData.eventoId },
    });

    if (checklistExistente) {
      throw new Error('Este evento já possui um checklist');
    }

    // Cria o checklist
    const checklist = await prisma.checklistEvento.create({
      data: {
        evento_idevento: checklistData.eventoId,
      },
    });

    // Cria as perguntas do checklist
    const perguntasPromises = checklistData.perguntas.map((pergunta) =>
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
   * Busca um checklist pelo ID
   * @param checklistId ID do checklist
   * @returns Checklist encontrado
   */
  async getChecklistById(checklistId: number) {
    const checklist = await prisma.checklistEvento.findUnique({
      where: { idchecklist_evento: checklistId },
      include: {
        evento: true,
        perguntas: true,
      },
    });

    if (!checklist) {
      throw new Error('Checklist não encontrado');
    }

    return {
      idchecklistEvento: checklist.idchecklist_evento,
      eventoIdevento: checklist.evento_idevento,
      evento: {
        nome: checklist.evento.nome,
      },
      perguntas: checklist.perguntas.map((pergunta) => ({
        idpergunta: pergunta.idpergunta,
        descricao: pergunta.descricao,
      })),
    };
  }

  /**
   * Busca um checklist pelo ID do evento
   * @param eventoId ID do evento
   * @returns Checklist encontrado
   */
  async getChecklistByEventoId(eventoId: number) {
    const checklist = await prisma.checklistEvento.findFirst({
      where: { evento_idevento: eventoId },
      include: {
        perguntas: true,
      },
    });

    if (!checklist) {
      throw new Error('Checklist não encontrado para este evento');
    }

    return {
      idchecklistEvento: checklist.idchecklist_evento,
      eventoIdevento: checklist.evento_idevento,
      perguntas: checklist.perguntas.map((pergunta) => ({
        idpergunta: pergunta.idpergunta,
        descricao: pergunta.descricao,
      })),
    };
  }

  /**
   * Atualiza um checklist
   * @param checklistId ID do checklist
   * @param checklistData Dados do checklist
   * @returns Checklist atualizado
   */
  async updateChecklist(checklistId: number, checklistData: UpdateChecklistDTO) {
    // Verifica se o checklist existe
    const checklistExistente = await prisma.checklistEvento.findUnique({
      where: { idchecklist_evento: checklistId },
    });

    if (!checklistExistente) {
      throw new Error('Checklist não encontrado');
    }

    // Se houver perguntas, atualiza as perguntas do checklist
    if (checklistData.perguntas) {
      // Remove todas as perguntas atuais
      await prisma.pergunta.deleteMany({
        where: { checklist_evento_idchecklist_evento: checklistId },
      });

      // Adiciona as novas perguntas
      const perguntasPromises = checklistData.perguntas.map((pergunta) =>
        prisma.pergunta.create({
          data: {
            descricao: pergunta.descricao,
            checklist_evento_idchecklist_evento: checklistId,
          },
        })
      );

      await Promise.all(perguntasPromises);
    }

    // Retorna o checklist atualizado
    return this.getChecklistById(checklistId);
  }

  /**
   * Adiciona uma pergunta ao checklist
   * @param perguntaData Dados da pergunta
   * @returns Pergunta criada
   */
  async addPergunta(perguntaData: AddPerguntaDTO) {
    // Verifica se o checklist existe
    const checklistExistente = await prisma.checklistEvento.findUnique({
      where: { idchecklist_evento: perguntaData.checklistId },
    });

    if (!checklistExistente) {
      throw new Error('Checklist não encontrado');
    }

    // Cria a pergunta
    const pergunta = await prisma.pergunta.create({
      data: {
        descricao: perguntaData.descricao,
        checklist_evento_idchecklist_evento: perguntaData.checklistId,
      },
    });

    return {
      idpergunta: pergunta.idpergunta,
      descricao: pergunta.descricao,
      checklistEventoIdchecklistEvento: pergunta.checklist_evento_idchecklist_evento,
    };
  }

  /**
   * Atualiza uma pergunta
   * @param perguntaId ID da pergunta
   * @param perguntaData Dados da pergunta
   * @returns Pergunta atualizada
   */
  async updatePergunta(perguntaId: number, perguntaData: UpdatePerguntaDTO) {
    // Verifica se a pergunta existe
    const perguntaExistente = await prisma.pergunta.findUnique({
      where: { idpergunta: perguntaId },
    });

    if (!perguntaExistente) {
      throw new Error('Pergunta não encontrada');
    }

    // Atualiza a pergunta
    const pergunta = await prisma.pergunta.update({
      where: { idpergunta: perguntaId },
      data: {
        descricao: perguntaData.descricao,
      },
    });

    return {
      idpergunta: pergunta.idpergunta,
      descricao: pergunta.descricao,
      checklistEventoIdchecklistEvento: pergunta.checklist_evento_idchecklist_evento,
    };
  }

  /**
   * Exclui uma pergunta
   * @param perguntaId ID da pergunta
   */
  async deletePergunta(perguntaId: number) {
    // Verifica se a pergunta existe
    const perguntaExistente = await prisma.pergunta.findUnique({
      where: { idpergunta: perguntaId },
    });

    if (!perguntaExistente) {
      throw new Error('Pergunta não encontrada');
    }

    // Verifica se a pergunta está sendo usada em algum artigo
    const perguntaArtigo = await prisma.perguntaArtigo.findFirst({
      where: { pergunta_idpergunta: perguntaId },
    });

    if (perguntaArtigo) {
      throw new Error('Esta pergunta não pode ser excluída pois está sendo usada em um artigo');
    }

    // Exclui a pergunta
    await prisma.pergunta.delete({
      where: { idpergunta: perguntaId },
    });

    return { success: true, message: 'Pergunta excluída com sucesso' };
  }

  /**
   * Exclui um checklist
   * @param checklistId ID do checklist
   */
  async deleteChecklist(checklistId: number) {
    // Verifica se o checklist existe
    const checklistExistente = await prisma.checklistEvento.findUnique({
      where: { idchecklist_evento: checklistId },
    });

    if (!checklistExistente) {
      throw new Error('Checklist não encontrado');
    }

    // Verifica se o checklist possui perguntas usadas em artigos
    const perguntasDoChecklist = await prisma.pergunta.findMany({
      where: { checklist_evento_idchecklist_evento: checklistId },
    });

    const perguntaIds = perguntasDoChecklist.map((pergunta) => pergunta.idpergunta);

    const perguntasEmUso = await prisma.perguntaArtigo.findFirst({
      where: {
        pergunta_idpergunta: {
          in: perguntaIds,
        },
      },
    });

    if (perguntasEmUso) {
      throw new Error('Este checklist não pode ser excluído pois possui perguntas que estão sendo usadas em artigos');
    }

    // Exclui as perguntas do checklist
    await prisma.pergunta.deleteMany({
      where: { checklist_evento_idchecklist_evento: checklistId },
    });

    // Exclui o checklist
    await prisma.checklistEvento.delete({
      where: { idchecklist_evento: checklistId },
    });

    return { success: true, message: 'Checklist excluído com sucesso' };
  }
}

export default new ChecklistService();