// Arquivo para simular chamadas de API

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Eventos
export async function getEventos() {
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
      nome: "Simpósio de Pesquisa Acadêmica",
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
  ];
}

export async function getEvento(id) {
  const eventos = await getEventos();
  return eventos.find((evento) => evento.id === parseInt(id)) || null;
}

// Artigos
export async function getArtigos(userId = null) {
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
    },
    {
      id: 2,
      titulo: "Sustentabilidade na Produção Agrícola",
      resumo: "Análise de métodos sustentáveis para produção agrícola...",
      area_tematica: "Agricultura e Meio Ambiente",
      status: "em_avaliacao",
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
    },
  ];

  if (userId) {
    return artigos.filter((artigo) =>
      artigo.autores.some((autor) => autor.id === parseInt(userId))
    );
  }

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
