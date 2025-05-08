// Helper para trabalhar com localStorage de maneira mais organizada

// Função para inicializar dados padrão caso não existam
export function initializeLocalStorage() {
  if (typeof window === "undefined") return;

  // Inicializa eventos se não existirem
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

  // Inicializa usuários
  if (!localStorage.getItem("usuarios")) {
    localStorage.setItem(
      "usuarios",
      JSON.stringify([
        {
          id: 1,
          nome: "João Silva",
          email: "joao@email.com",
          senha: "123456", // Em produção, nunca armazene senhas em texto simples
          data_nascimento: "1990-05-15",
          cargos: ["autor"],
        },
        {
          id: 2,
          nome: "Maria Oliveira",
          email: "maria@email.com",
          senha: "123456",
          data_nascimento: "1985-10-20",
          cargos: ["autor", "avaliador"],
        },
        {
          id: 3,
          nome: "Carlos Mendes",
          email: "carlos@email.com",
          senha: "123456",
          data_nascimento: "1980-03-08",
          cargos: ["autor"],
        },
        {
          id: 20,
          nome: "Admin",
          email: "admin@email.com",
          senha: "admin123",
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

// Função para obter um novo ID para uma entidade
export function getNextId(entity) {
  if (typeof window === "undefined") return 1;

  const contadores = JSON.parse(localStorage.getItem("contadores") || "{}");
  const nextId = contadores[entity] || 1;
  contadores[entity] = nextId + 1;
  localStorage.setItem("contadores", JSON.stringify(contadores));
  return nextId;
}

// Função genérica para obter todos os itens de um tipo
export function getItems(itemType) {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem(itemType) || "[]");
}

// Função genérica para obter um item específico por ID
export function getItemById(itemType, id) {
  if (typeof window === "undefined") return null;

  const items = getItems(itemType);
  return items.find((item) => item.id === parseInt(id)) || null;
}

// Função genérica para criar um novo item
export function createItem(itemType, data) {
  if (typeof window === "undefined") return null;

  const items = getItems(itemType);
  const entityType = itemType.endsWith("s")
    ? itemType.substring(0, itemType.length - 1)
    : itemType;

  const newItem = {
    id: getNextId(entityType),
    ...data,
  };

  items.push(newItem);
  localStorage.setItem(itemType, JSON.stringify(items));
  return newItem;
}

// Função genérica para atualizar um item
export function updateItem(itemType, id, data) {
  if (typeof window === "undefined") return null;

  const items = getItems(itemType);
  const index = items.findIndex((item) => item.id === parseInt(id));

  if (index === -1) {
    throw new Error(`Item ${itemType} com ID ${id} não encontrado`);
  }

  items[index] = {
    ...items[index],
    ...data,
  };

  localStorage.setItem(itemType, JSON.stringify(items));
  return items[index];
}

// Função genérica para excluir um item
export function deleteItem(itemType, id) {
  if (typeof window === "undefined") return false;

  const items = getItems(itemType);
  const filteredItems = items.filter((item) => item.id !== parseInt(id));

  if (filteredItems.length === items.length) {
    return false; // Item não encontrado
  }

  localStorage.setItem(itemType, JSON.stringify(filteredItems));
  return true;
}

// Funções específicas para entidades comuns

// Eventos
export const eventoStore = {
  getAll: () => getItems("eventos"),
  getById: (id) => getItemById("eventos", id),
  getAtivos: () =>
    getItems("eventos").filter((evento) => evento.status === "ativo"),
  getPlanned: () =>
    getItems("eventos").filter((evento) => evento.status === "planejado"),
  getClosed: () =>
    getItems("eventos").filter((evento) => evento.status === "encerrado"),
  create: (data) => createItem("eventos", data),
  update: (id, data) => updateItem("eventos", id, data),
  delete: (id) => deleteItem("eventos", id),
};

// Artigos
export const artigoStore = {
  getAll: () => getItems("artigos"),
  getById: (id) => getItemById("artigos", id),
  getByAutor: (autorId) =>
    getItems("artigos").filter((artigo) =>
      artigo.autores.some((autor) => autor.id === parseInt(autorId))
    ),
  getByEvento: (eventoId) =>
    getItems("artigos").filter(
      (artigo) => artigo.evento_id === parseInt(eventoId)
    ),
  getByStatus: (status) =>
    getItems("artigos").filter((artigo) => artigo.status === status),
  create: (data) => createItem("artigos", data),
  update: (id, data) => updateItem("artigos", id, data),
  updateStatus: (id, status) => {
    const artigo = getItemById("artigos", id);
    if (!artigo) throw new Error(`Artigo com ID ${id} não encontrado`);

    return updateItem("artigos", id, { status });
  },
  delete: (id) => deleteItem("artigos", id),
};

// Usuários
export const usuarioStore = {
  getAll: () => getItems("usuarios"),
  getById: (id) => getItemById("usuarios", id),
  getByCargo: (cargo) =>
    getItems("usuarios").filter((usuario) => usuario.cargos.includes(cargo)),
  getByEmail: (email) =>
    getItems("usuarios").find((usuario) => usuario.email === email),
  create: (data) => {
    // Verifica se o email já está em uso
    const usuarios = getItems("usuarios");
    if (usuarios.some((u) => u.email === data.email)) {
      throw new Error("Email já está em uso");
    }

    return createItem("usuarios", data);
  },
  update: (id, data) => {
    // Verifica se o email já está em uso por outro usuário
    if (data.email) {
      const usuarios = getItems("usuarios");
      const usuarioExistente = getItemById("usuarios", id);

      if (usuarioExistente && data.email !== usuarioExistente.email) {
        const emailEmUso = usuarios.some(
          (u) => u.id !== parseInt(id) && u.email === data.email
        );
        if (emailEmUso) {
          throw new Error("Email já está em uso");
        }
      }
    }

    return updateItem("usuarios", id, data);
  },
  delete: (id) => deleteItem("usuarios", id),
  authenticate: (email, senha) => {
    const usuario = getItems("usuarios").find((u) => u.email === email);
    if (!usuario || usuario.senha !== senha) {
      throw new Error("Credenciais inválidas");
    }
    return usuario;
  },
};

// Avaliações
export const avaliacaoStore = {
  getAll: () => getItems("avaliacoes"),
  getById: (id) => getItemById("avaliacoes", id),
  getByArtigo: (artigoId) =>
    getItems("avaliacoes").filter(
      (avaliacao) => avaliacao.artigo_id === parseInt(artigoId)
    ),
  getByAvaliador: (avaliadorId) =>
    getItems("avaliacoes").filter(
      (avaliacao) => avaliacao.avaliador_id === parseInt(avaliadorId)
    ),
  create: (data) => {
    // Verifica se já existe uma avaliação deste avaliador para este artigo
    const avaliacoes = getItems("avaliacoes");
    const avaliacaoExistente = avaliacoes.find(
      (av) =>
        av.artigo_id === data.artigo_id && av.avaliador_id === data.avaliador_id
    );

    if (avaliacaoExistente) {
      // Atualiza avaliação existente
      return updateItem("avaliacoes", avaliacaoExistente.id, {
        ...data,
        data_avaliacao: new Date().toISOString().split("T")[0],
      });
    }

    // Cria nova avaliação
    return createItem("avaliacoes", {
      ...data,
      data_avaliacao: data.nota ? new Date().toISOString().split("T")[0] : null,
    });
  },
  update: (id, data) =>
    updateItem("avaliacoes", id, {
      ...data,
      data_avaliacao: data.nota ? new Date().toISOString().split("T")[0] : null,
    }),
  delete: (id) => deleteItem("avaliacoes", id),
};

// Inicializa os dados padrão quando o módulo é carregado
if (typeof window !== "undefined") {
  initializeLocalStorage();
}
