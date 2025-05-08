// Arquivo para simular chamadas de API
import api from "../services/api";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Eventos
export async function getEventos(institutionId = null) {
  if (institutionId) {
    // Código para quando a API estiver disponível
    /*
    try {
      const response = await api.get(`/eventos/${institutionId}/eventos`);

      if (response && response.data) {
        console.log("Eventos recebidos:", response.data);
        return response.data;
      } else {
        console.error("Erro ao receber dados dos eventos:", response);
        return [];
      }
    } catch (error) {
      console.error("Falha ao buscar eventos da instituição:", error);
      return [];
    }
    */
  }
  /*
  const fetchData = async () => {
    const responseData = await api.get("/eventos");

    if (responseData && responseData.data) {
      console.log("Dados recebidos:", responseData.data);
    } else {
      console.error("Erro ao receber dados:", responseData);
    }
  };
  const result = fetchData();
  if (result.lenght <= 0) {
  */
  await delay(500);
  return [
    {
      id: 1,
      nome: "Congresso Biopark de Inovação 2025",
      banner: "/congresso1.jpg",
      descricao:
        "Evento anual para apresentação de inovações tecnológicas da faculdade",
      data_inicio: "2025-08-15",
      data_fim: "2025-08-20",
      status: "ativo",
    },
    {
      id: 2,
      nome: "Simpósio de Pesquisa Acadêmica Biopark",
      banner: "/congresso2.jpg",
      descricao: "Evento semestral para apresentação de pesquisas acadêmicas",
      data_inicio: "2025-06-10",
      data_fim: "2025-06-12",
      status: "ativo",
    },
    {
      id: 3,
      nome: "Workshop de Metodologia Científica",
      banner: "/images/evento3.jpg",
      descricao: "Workshop intensivo sobre metodologias de pesquisa científica",
      data_inicio: "2025-09-05",
      data_fim: "2025-09-07",
      status: "planejado",
    },
    {
      id: 4,
      nome: "Workshop de Metodologia Científica",
      banner: "/images/evento3.jpg",
      descricao: "Workshop intensivo sobre metodologias de pesquisa científica",
      data_inicio: "2025-09-05",
      data_fim: "2025-09-07",
      status: "encerrado",
    },
  ];
  /* }
  return result;
  */
}

export async function getEvento(id) {
  const eventos = await getEventos();
  return eventos.find((evento) => evento.id === parseInt(id)) || null;
}

// Artigos
export async function getArtigos(autorId) {
  // Código para quando a API estiver disponível
  /*
  try {
    const response = await api.get(`/usuarios/${Number(autorId)}/artigos`);

    if (response && response.data) {
      console.log("Artigos do autor recebidos:", response.data);
      return response.data;
    } else {
      console.error("Erro ao receber dados dos artigos:", response);
      return [];
    }
  } catch (error) {
    console.error("Falha ao buscar artigos do autor:", error);
    return [];
  }
  */
  await delay(500);
  const artigos = [
    {
      id: 1,
      titulo: "Aplicação de Inteligência Artificial na Saúde",
      resumo:
        "Este artigo apresenta uma revisão das aplicações de IA na medicina...",
      area_tematica: "Tecnologia em Saúde",
      status: "submetido",
      autores: [
        { id: 1, nome: "João Silva" },
        { id: 2, nome: "Maria Oliveira" },
      ],
      palavras_chave: ["Inteligência Artificial", "Saúde", "Machine Learning"],
      evento_id: 1,
      versao_atual: {
        id: 1,
        versao: "1.0",
        data_cadastro: "2025-03-15",
      },
      evento: "Congresso Biopark de Inovação 2025",
    },
    {
      id: 2,
      titulo: "Sustentabilidade na Produção Agrícola",
      resumo: "Análise de métodos sustentáveis para produção agrícola...",
      area_tematica: "Agricultura e Meio Ambiente",
      status: "aguardando_correcao",
      autores: [
        { id: 1, nome: "João Silva" },
        { id: 3, nome: "Carlos Mendes" },
      ],
      palavras_chave: ["Sustentabilidade", "Agricultura", "Meio Ambiente"],
      evento_id: 1,
      versao_atual: {
        id: 2,
        versao: "1.0",
        data_cadastro: "2025-04-10",
      },
      evento: "Congresso Biopark de Inovação 2025",
    },
    {
      id: 3,
      titulo: "Avanços em Biotecnologia para Tratamento de Doenças Raras",
      resumo: "Estudo sobre os avanços recentes em biotecnologia...",
      area_tematica: "Biotecnologia",
      status: "submetido",
      autores: [
        { id: 4, nome: "Ana Ferreira" },
        { id: 5, nome: "Paulo Santos" },
      ],
      palavras_chave: ["Biotecnologia", "Doenças Raras", "Tratamento"],
      evento_id: 2,
      versao_atual: {
        id: 3,
        versao: "1.0",
        data_cadastro: "2025-04-20",
      },
      evento: "Simpósio de Pesquisa Acadêmica Biopark",
    },
    {
      id: 4,
      titulo: "Avanços em Biotecnologia para Tratamento de Doenças Raras",
      resumo: "Estudo sobre os avanços recentes em biotecnologia...",
      area_tematica: "Biotecnologia",
      status: "aprovado",
      autores: [
        { id: 4, nome: "Ana Ferreira" },
        { id: 5, nome: "Paulo Santos" },
      ],
      palavras_chave: ["Biotecnologia", "Doenças Raras", "Tratamento"],
      evento_id: 2,
      versao_atual: {
        id: 3,
        versao: "1.0",
        data_cadastro: "2025-04-20",
      },
      evento: "Simpósio de Pesquisa Acadêmica Biopark",
    },
    {
      id: 5,
      titulo: "Avanços em Biotecnologia para Tratamento de Doenças Raras",
      resumo: "Estudo sobre os avanços recentes em biotecnologia...",
      area_tematica: "Biotecnologia",
      status: "reprovado",
      autores: [
        { id: 4, nome: "Ana Ferreira" },
        { id: 5, nome: "Paulo Santos" },
      ],
      palavras_chave: ["Biotecnologia", "Doenças Raras", "Tratamento"],
      evento_id: 2,
      versao_atual: {
        id: 3,
        versao: "1.0",
        data_cadastro: "2025-04-20",
      },
      evento: "Simpósio de Pesquisa Acadêmica Biopark",
    },
  ];

  // if (userId) {
  //   return artigos.filter((artigo) =>
  //     artigo.autores.some((autor) => autor.id === parseInt(userId))
  //   );
  // }

  return artigos;
}

export async function getArtigo(id) {
  const artigos = await getArtigos();
  return artigos.find((artigo) => artigo.id === parseInt(id)) || null;
}

export async function createArtigo(data) {
  await delay(800);
  // Simula a criação de um artigo
  return {
    id: Math.floor(Math.random() * 1000) + 10,
    ...data,
    status: "submetido",
    versao_atual: {
      id: Math.floor(Math.random() * 1000) + 10,
      versao: "1.0",
      data_cadastro: new Date().toISOString().split("T")[0],
    },
  };
}

// Avaliações
export async function getAvaliacoes(userId = null) {
  await delay(500);
  const avaliacoes = [
    {
      id: 1,
      artigo_id: 1,
      artigo_titulo: "Aplicação de Inteligência Artificial na Saúde",
      nota: 9.5,
      observacao: "Excelente artigo, contribuição relevante para a área",
      data_avaliacao: "2025-04-01",
      avaliador_id: 10,
    },
    {
      id: 2,
      artigo_id: 2,
      artigo_titulo: "Sustentabilidade na Produção Agrícola",
      nota: null, // Ainda não avaliado
      observacao: "",
      data_avaliacao: null,
      avaliador_id: 10,
    },
    {
      id: 3,
      artigo_id: 3,
      artigo_titulo:
        "Avanços em Biotecnologia para Tratamento de Doenças Raras",
      nota: 8.0,
      observacao: "Bom artigo, mas precisa de algumas revisões na metodologia",
      data_avaliacao: "2025-04-25",
      avaliador_id: 11,
    },
  ];

  if (userId) {
    return avaliacoes.filter(
      (avaliacao) => avaliacao.avaliador_id === parseInt(userId)
    );
  }

  return avaliacoes;
}

export async function getAvaliacao(id) {
  const avaliacoes = await getAvaliacoes();
  return avaliacoes.find((avaliacao) => avaliacao.id === parseInt(id)) || null;
}

export async function submitAvaliacao(data) {
  await delay(800);
  // Simula o envio de uma avaliação
  return {
    id: Math.floor(Math.random() * 1000) + 10,
    ...data,
    data_avaliacao: new Date().toISOString().split("T")[0],
  };
}

// Usuários
export async function getUsuarios() {
  await delay(500);
  return [
    {
      id: 1,
      nome: "João Silva",
      email: "joao.silva@email.com",
      data_nascimento: "1990-05-15",
      cargos: ["autor"],
    },
    {
      id: 2,
      nome: "Maria Oliveira",
      email: "maria.oliveira@email.com",
      data_nascimento: "1985-10-20",
      cargos: ["autor", "avaliador"],
    },
    {
      id: 3,
      nome: "Carlos Mendes",
      email: "carlos.mendes@email.com",
      data_nascimento: "1980-03-08",
      cargos: ["autor"],
    },
    {
      id: 4,
      nome: "Ana Ferreira",
      email: "ana.ferreira@email.com",
      data_nascimento: "1992-07-12",
      cargos: ["autor"],
    },
    {
      id: 5,
      nome: "Paulo Santos",
      email: "paulo.santos@email.com",
      data_nascimento: "1978-11-30",
      cargos: ["autor", "avaliador"],
    },
    {
      id: 10,
      nome: "Roberto Almeida",
      email: "roberto.almeida@email.com",
      data_nascimento: "1975-09-22",
      cargos: ["avaliador"],
    },
    {
      id: 11,
      nome: "Fernanda Costa",
      email: "fernanda.costa@email.com",
      data_nascimento: "1982-06-18",
      cargos: ["avaliador"],
    },
    {
      id: 20,
      nome: "Ricardo Sousa",
      email: "ricardo.sousa@email.com",
      data_nascimento: "1970-01-05",
      cargos: ["coordenador"],
    },
  ];
}

export async function getUsuario(id) {
  const usuarios = await getUsuarios();
  return usuarios.find((usuario) => usuario.id === parseInt(id)) || null;
}

export async function createUsuario(data) {
  await delay(800);
  // Simula a criação de um usuário
  return {
    id: Math.floor(Math.random() * 1000) + 10,
    ...data,
  };
}

// Checklists
export async function getChecklists(eventoId = null) {
  await delay(500);
  
  const checklists = [
    {
      id: 1,
      nome: 'Checklist de Avaliação Padrão',
      descricao: 'Critérios para avaliação básica de todos os artigos submetidos ao congresso.',
      evento_id: 1,
      evento_nome: 'Congresso Biopark de Inovação 2025',
      criado_em: '2025-03-15',
      ultima_atualizacao: '2025-04-10',
      perguntas: [
        { id: 1, texto: 'O artigo está formatado de acordo com o template?', tipo: 'sim_nao', obrigatoria: true },
        { id: 2, texto: 'A metodologia está claramente descrita?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'As referências seguem o padrão da ABNT?', tipo: 'sim_nao', obrigatoria: true },
        { id: 4, texto: 'O resumo está completo e claro?', tipo: 'sim_nao', obrigatoria: true },
        { id: 5, texto: 'Os resultados são apresentados de forma adequada?', tipo: 'escala', obrigatoria: true },
        { id: 6, texto: 'As conclusões são consistentes com os resultados?', tipo: 'escala', obrigatoria: true },
        { id: 7, texto: 'A contribuição do trabalho para a área é significativa?', tipo: 'escala', obrigatoria: true },
        { id: 8, texto: 'Comentários adicionais para os autores:', tipo: 'texto', obrigatoria: false }
      ]
    },
    {
      id: 2,
      nome: 'Critérios de Qualidade Técnica',
      descricao: 'Checklist específico para avaliação de aspectos técnicos dos artigos.',
      evento_id: 1,
      evento_nome: 'Congresso Biopark de Inovação 2025',
      criado_em: '2025-03-18',
      ultima_atualizacao: '2025-03-18',
      perguntas: [
        { id: 1, texto: 'A metodologia utilizada é adequada?', tipo: 'escala', obrigatoria: true },
        { id: 2, texto: 'Os experimentos são reproduzíveis?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'Os dados estão bem organizados e apresentados?', tipo: 'escala', obrigatoria: true },
        { id: 4, texto: 'A análise estatística é adequada?', tipo: 'escala', obrigatoria: true },
        { id: 5, texto: 'As limitações do estudo são discutidas?', tipo: 'sim_nao', obrigatoria: true },
        { id: 6, texto: 'As conclusões são justificadas pelos dados?', tipo: 'sim_nao', obrigatoria: true },
        { id: 7, texto: 'O trabalho apresenta originalidade?', tipo: 'escala', obrigatoria: true },
        { id: 8, texto: 'O trabalho traz contribuições relevantes para a área?', tipo: 'escala', obrigatoria: true },
        { id: 9, texto: 'A literatura citada é atual e relevante?', tipo: 'sim_nao', obrigatoria: true },
        { id: 10, texto: 'A qualidade da escrita e da apresentação é adequada?', tipo: 'escala', obrigatoria: true },
        { id: 11, texto: 'Há problemas éticos identificados?', tipo: 'sim_nao', obrigatoria: true },
        { id: 12, texto: 'Comentários para os autores:', tipo: 'texto', obrigatoria: false }
      ]
    },
    {
      id: 3,
      nome: 'Checklist para Artigos de Pesquisa',
      descricao: 'Critérios específicos para avaliação de artigos de pesquisa científica.',
      evento_id: 2,
      evento_nome: 'Simpósio de Pesquisa Acadêmica',
      criado_em: '2025-04-02',
      ultima_atualizacao: '2025-04-15',
      perguntas: [
        { id: 1, texto: 'O problema de pesquisa está claramente definido?', tipo: 'sim_nao', obrigatoria: true },
        { id: 2, texto: 'Os objetivos da pesquisa estão claramente definidos?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'A revisão de literatura é abrangente e atual?', tipo: 'escala', obrigatoria: true },
        { id: 4, texto: 'A metodologia é adequada aos objetivos?', tipo: 'escala', obrigatoria: true },
        { id: 5, texto: 'Os resultados são apresentados de forma clara?', tipo: 'escala', obrigatoria: true },
        { id: 6, texto: 'A análise dos resultados é crítica e fundamentada?', tipo: 'escala', obrigatoria: true },
        { id: 7, texto: 'As conclusões respondem aos objetivos propostos?', tipo: 'sim_nao', obrigatoria: true },
        { id: 8, texto: 'O artigo apresenta contribuição original?', tipo: 'escala', obrigatoria: true },
        { id: 9, texto: 'A qualidade da escrita é adequada?', tipo: 'escala', obrigatoria: true },
        { id: 10, texto: 'Sugestões para melhoria do artigo:', tipo: 'texto', obrigatoria: false }
      ]
    },
    {
      id: 4,
      nome: 'Avaliação de Trabalhos Teóricos',
      descricao: 'Checklist para avaliação de artigos de natureza teórica ou revisões de literatura.',
      evento_id: 2,
      evento_nome: 'Simpósio de Pesquisa Acadêmica',
      criado_em: '2025-04-05',
      ultima_atualizacao: '2025-04-05',
      perguntas: [
        { id: 1, texto: 'O tema é relevante para a área?', tipo: 'escala', obrigatoria: true },
        { id: 2, texto: 'O escopo do trabalho está bem delimitado?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'A fundamentação teórica é sólida?', tipo: 'escala', obrigatoria: true },
        { id: 4, texto: 'A revisão de literatura abrange as principais referências da área?', tipo: 'escala', obrigatoria: true },
        { id: 5, texto: 'As discussões são profundas e bem articuladas?', tipo: 'escala', obrigatoria: true },
        { id: 6, texto: 'O artigo apresenta novas perspectivas ou insights?', tipo: 'escala', obrigatoria: true },
        { id: 7, texto: 'A argumentação é coerente e bem estruturada?', tipo: 'sim_nao', obrigatoria: true },
        { id: 8, texto: 'As conclusões são bem fundamentadas?', tipo: 'sim_nao', obrigatoria: true },
        { id: 9, texto: 'Comentários e sugestões para os autores:', tipo: 'texto', obrigatoria: false }
      ]
    },
    {
      id: 5,
      nome: 'Checklist para Relatos de Experiência',
      descricao: 'Avaliação específica para artigos que descrevem experiências práticas e estudos de caso.',
      evento_id: 3,
      evento_nome: 'Workshop de Metodologia Científica',
      criado_em: '2025-05-10',
      ultima_atualizacao: '2025-05-10',
      perguntas: [
        { id: 1, texto: 'O contexto da experiência está claramente descrito?', tipo: 'sim_nao', obrigatoria: true },
        { id: 2, texto: 'Os objetivos da experiência estão bem definidos?', tipo: 'sim_nao', obrigatoria: true },
        { id: 3, texto: 'A metodologia ou abordagem utilizada está bem explicada?', tipo: 'escala', obrigatoria: true },
        { id: 4, texto: 'Os resultados ou observações estão bem documentados?', tipo: 'escala', obrigatoria: true },
        { id: 5, texto: 'Há reflexão crítica sobre a experiência?', tipo: 'escala', obrigatoria: true },
        { id: 6, texto: 'O relato oferece contribuições ou lições aprendidas para a área?', tipo: 'escala', obrigatoria: true },
        { id: 7, texto: 'A experiência poderia ser replicada por outros?', tipo: 'sim_nao', obrigatoria: true },
        { id: 8, texto: 'As limitações da experiência são discutidas?', tipo: 'sim_nao', obrigatoria: true },
        { id: 9, texto: 'Comentários para os autores:', tipo: 'texto', obrigatoria: false }
      ]
    }
  ];

  // Se um ID de evento for fornecido, filtra os checklists para esse evento
  if (eventoId) {
    return checklists.filter(checklist => checklist.evento_id === parseInt(eventoId));
  }
  
  return checklists;
}

// Método para obter um checklist específico por ID
export async function getChecklist(id) {
  const checklists = await getChecklists();
  return checklists.find(checklist => checklist.id === parseInt(id)) || null;
}

// Método para criar um novo checklist
export async function createChecklist(data) {
  await delay(800);
  
  // Simula a criação de um checklist
  const newId = Math.floor(Math.random() * 1000) + 10;
  
  return {
    id: newId,
    ...data,
    criado_em: new Date().toISOString().split('T')[0],
    ultima_atualizacao: new Date().toISOString().split('T')[0]
  };
}

// Método para atualizar um checklist existente
export async function updateChecklist(id, data) {
  await delay(800);
  
  // Simula a atualização de um checklist
  return {
    id: parseInt(id),
    ...data,
    ultima_atualizacao: new Date().toISOString().split('T')[0]
  };
}

// Método para excluir um checklist
export async function deleteChecklist(id) {
  await delay(500);
  
  // Simula a exclusão de um checklist
  return { success: true };
}

// Método para obter os checklists associados a um artigo
export async function getChecklistsForArtigo(artigoId) {
  // Em um cenário real, consultaríamos o banco de dados para encontrar
  // quais checklists devem ser usados para avaliar este artigo específico,
  // com base no evento ao qual o artigo pertence.
  
  await delay(500);
  
  // Para fins de demonstração, vamos supor que o artigo está associado
  // ao evento com ID 1 (que tem os checklists 1 e 2)
  const checklists = await getChecklists(1);
  
  // Em um cenário real, podemos ter configurações específicas de quais
  // checklists usar para quais artigos. Aqui simplificamos usando todos
  // os checklists do evento.
  return checklists;
}