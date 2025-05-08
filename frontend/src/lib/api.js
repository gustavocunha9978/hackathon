// api.js - Implementação utilizando localStorage para persistir dados

// Função de utilidade para simular delay nas operações
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Função para inicializar dados padrão se não existirem no localStorage
function initializeLocalStorage() {
  // Inicializa eventos
  if (!localStorage.getItem("eventos")) {
    localStorage.setItem(
      "eventos",
      JSON.stringify([
        {
          id: 1,
          nome: "Congresso Biopark de Inovação 2025",
          banner: "/images/evento1.jpg",
          descricao:
            "Evento anual para apresentação de inovações tecnológicas da faculdade",
          data_inicio: "2025-08-15",
          data_fim: "2025-08-20",
          status: "ativo",
        },
        {
          id: 2,
          nome: "Simpósio de Pesquisa Acadêmica",
          banner: "/images/evento2.jpg",
          descricao:
            "Evento semestral para apresentação de pesquisas acadêmicas",
          data_inicio: "2025-06-10",
          data_fim: "2025-06-12",
          status: "ativo",
        },
        {
          id: 3,
          nome: "Workshop de Metodologia Científica",
          banner: "/images/evento3.jpg",
          descricao:
            "Workshop intensivo sobre metodologias de pesquisa científica",
          data_inicio: "2025-09-05",
          data_fim: "2025-09-07",
          status: "planejado",
        },
      ])
    );
  }

  // Inicializa artigos
  if (!localStorage.getItem("artigos")) {
    localStorage.setItem(
      "artigos",
      JSON.stringify([
        {
          id: 1,
          titulo: "Aplicação de Inteligência Artificial na Saúde",
          resumo:
            "Este artigo apresenta uma revisão das aplicações de IA na medicina...",
          area_tematica: "Tecnologia em Saúde",
          status: "aprovado",
          autores: [
            { id: 1, nome: "João Silva" },
            { id: 2, nome: "Maria Oliveira" },
          ],
          palavras_chave: [
            "Inteligência Artificial",
            "Saúde",
            "Machine Learning",
          ],
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
      ])
    );
  }

  // Inicializa avaliações
  if (!localStorage.getItem("avaliacoes")) {
    localStorage.setItem(
      "avaliacoes",
      JSON.stringify([
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
          observacao:
            "Bom artigo, mas precisa de algumas revisões na metodologia",
          data_avaliacao: "2025-04-25",
          avaliador_id: 11,
        },
      ])
    );
  }

  // Inicializa usuários
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem(
      "usuarios",
      JSON.stringify([
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
      ])
    );
  }

  // Inicializa contadores para novos IDs
  if (!localStorage.getItem("contadores")) {
    localStorage.setItem(
      "contadores",
      JSON.stringify({
        evento: 4,
        artigo: 4,
        usuario: 21,
        avaliacao: 4,
      })
    );
  }
}

// Função para gerar um novo ID para determinada entidade
function getNextId(entity) {
  const contadores = JSON.parse(localStorage.getItem("contadores"));
  const nextId = contadores[entity];
  contadores[entity] = nextId + 1;
  localStorage.setItem("contadores", JSON.stringify(contadores));
  return nextId;
}

// Inicializa o localStorage quando o módulo é carregado
if (typeof window !== "undefined") {
  initializeLocalStorage();
}

// Funções para Eventos
export async function getEventos() {
  await delay(300);
  return JSON.parse(localStorage.getItem("eventos") || "[]");
}

export async function getEvento(id) {
  await delay(200);
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  return eventos.find((evento) => evento.id === parseInt(id)) || null;
}

export async function createEvento(data) {
  await delay(500);
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  const novoEvento = {
    id: getNextId("evento"),
    ...data,
    // Valores padrão caso não sejam fornecidos
    banner: data.banner || "/images/default.jpg",
    status: data.status || "planejado",
  };

  eventos.push(novoEvento);
  localStorage.setItem("eventos", JSON.stringify(eventos));
  return novoEvento;
}

export async function updateEvento(id, data) {
  await delay(500);
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  const index = eventos.findIndex((evento) => evento.id === parseInt(id));

  if (index === -1) {
    throw new Error("Evento não encontrado");
  }

  eventos[index] = {
    ...eventos[index],
    ...data,
  };

  localStorage.setItem("eventos", JSON.stringify(eventos));
  return eventos[index];
}

export async function deleteEvento(id) {
  await delay(300);
  const eventos = JSON.parse(localStorage.getItem("eventos") || "[]");
  const filteredEventos = eventos.filter(
    (evento) => evento.id !== parseInt(id)
  );

  if (filteredEventos.length === eventos.length) {
    throw new Error("Evento não encontrado");
  }

  localStorage.setItem("eventos", JSON.stringify(filteredEventos));
  return { success: true };
}

// Funções para Artigos
export async function getArtigos(userId = null) {
  await delay(300);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");

  if (userId) {
    return artigos.filter((artigo) =>
      artigo.autores.some((autor) => autor.id === parseInt(userId))
    );
  }

  return artigos;
}

export async function getArtigo(id) {
  await delay(200);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
  return artigos.find((artigo) => artigo.id === parseInt(id)) || null;
}

export async function createArtigo(data) {
  await delay(500);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
  const versaoId = getNextId("versao");

  const novoArtigo = {
    id: getNextId("artigo"),
    ...data,
    status: "submetido",
    versao_atual: {
      id: versaoId,
      versao: "1.0",
      data_cadastro: new Date().toISOString().split("T")[0],
    },
  };

  artigos.push(novoArtigo);
  localStorage.setItem("artigos", JSON.stringify(artigos));
  return novoArtigo;
}

export async function updateArtigo(id, data) {
  await delay(500);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
  const index = artigos.findIndex((artigo) => artigo.id === parseInt(id));

  if (index === -1) {
    throw new Error("Artigo não encontrado");
  }

  artigos[index] = {
    ...artigos[index],
    ...data,
  };

  localStorage.setItem("artigos", JSON.stringify(artigos));
  return artigos[index];
}

export async function updateStatusArtigo(id, novoStatus) {
  await delay(300);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
  const index = artigos.findIndex((artigo) => artigo.id === parseInt(id));

  if (index === -1) {
    throw new Error("Artigo não encontrado");
  }

  artigos[index].status = novoStatus;
  localStorage.setItem("artigos", JSON.stringify(artigos));
  return artigos[index];
}

export async function deleteArtigo(id) {
  await delay(300);
  const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
  const filteredArtigos = artigos.filter(
    (artigo) => artigo.id !== parseInt(id)
  );

  if (filteredArtigos.length === artigos.length) {
    throw new Error("Artigo não encontrado");
  }

  localStorage.setItem("artigos", JSON.stringify(filteredArtigos));
  return { success: true };
}

// Funções para Avaliações
export async function getAvaliacoes(userId = null) {
  await delay(300);
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");

  if (userId) {
    return avaliacoes.filter(
      (avaliacao) => avaliacao.avaliador_id === parseInt(userId)
    );
  }

  return avaliacoes;
}

export async function getAvaliacao(id) {
  await delay(200);
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  return avaliacoes.find((avaliacao) => avaliacao.id === parseInt(id)) || null;
}

export async function submitAvaliacao(data) {
  await delay(500);
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  const novaAvaliacao = {
    id: getNextId("avaliacao"),
    ...data,
    data_avaliacao: new Date().toISOString().split("T")[0],
  };

  // Se já existe uma avaliação para este artigo e avaliador, atualiza
  const index = avaliacoes.findIndex(
    (avaliacao) =>
      avaliacao.artigo_id === data.artigo_id &&
      avaliacao.avaliador_id === data.avaliador_id
  );

  if (index !== -1) {
    avaliacoes[index] = {
      ...avaliacoes[index],
      ...novaAvaliacao,
    };
  } else {
    avaliacoes.push(novaAvaliacao);
  }

  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

  // Atualiza o status do artigo se necessário
  if (data.nota !== null) {
    const artigos = JSON.parse(localStorage.getItem("artigos") || "[]");
    const artigoIndex = artigos.findIndex(
      (artigo) => artigo.id === data.artigo_id
    );

    if (artigoIndex !== -1) {
      // Lógica simplificada: se nota >= 7, aprova; se < 7, pede revisão
      if (data.nota >= 7) {
        artigos[artigoIndex].status = "aprovado";
      } else {
        artigos[artigoIndex].status = "revisao";
      }

      localStorage.setItem("artigos", JSON.stringify(artigos));
    }
  }

  return novaAvaliacao;
}

// Funções para Usuários
export async function getUsuarios() {
  await delay(300);
  return JSON.parse(localStorage.getItem("usuarios") || "[]");
}

export async function getUsuario(id) {
  await delay(200);
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  return usuarios.find((usuario) => usuario.id === parseInt(id)) || null;
}

export async function createUsuario(data) {
  await delay(500);
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");

  // Verifica se o email já está em uso
  const emailExistente = usuarios.some(
    (usuario) => usuario.email === data.email
  );
  if (emailExistente) {
    throw new Error("Email já está em uso");
  }

  const novoUsuario = {
    id: getNextId("usuario"),
    ...data,
    cargos: data.cargos || ["autor"], // Por padrão, todo usuário é autor
  };

  usuarios.push(novoUsuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return novoUsuario;
}

export async function updateUsuario(id, data) {
  await delay(500);
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const index = usuarios.findIndex((usuario) => usuario.id === parseInt(id));

  if (index === -1) {
    throw new Error("Usuário não encontrado");
  }

  // Verifica se o email já está em uso por outro usuário
  if (data.email && data.email !== usuarios[index].email) {
    const emailExistente = usuarios.some(
      (usuario, i) => i !== index && usuario.email === data.email
    );

    if (emailExistente) {
      throw new Error("Email já está em uso");
    }
  }

  usuarios[index] = {
    ...usuarios[index],
    ...data,
  };

  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  return usuarios[index];
}

export async function deleteUsuario(id) {
  await delay(300);
  const usuarios = JSON.parse(localStorage.getItem("usuarios") || "[]");
  const filteredUsuarios = usuarios.filter(
    (usuario) => usuario.id !== parseInt(id)
  );

  if (filteredUsuarios.length === usuarios.length) {
    throw new Error("Usuário não encontrado");
  }

  localStorage.setItem("usuarios", JSON.stringify(filteredUsuarios));
  return { success: true };
}
