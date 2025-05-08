// Funções de API para o HackSubmit
"use client";
import Cookies from "js-cookie";
import api from "../services/api"; // Importa a instância do axios que você já possui

// Eventos
export async function getEventos(institutionId = null) {
  try {
    let endpoint = "/eventos";

    if (institutionId) {
      endpoint = `/eventos/${institutionId}`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar eventos:", error);
    return [];
  }
}

export async function getEvento(id) {
  try {
    const response = await api.get(`/eventos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar evento ${id}:`, error);
    return null;
  }
}

// Artigos
export async function getArtigos(autorId = null) {
  try {
    let endpoint = "/artigos";

    if (autorId) {
      endpoint = `/usuarios/${autorId}/artigos`;
    }

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar artigos:", error);
    return [];
  }
}

export async function getArtigo(id) {
  try {
    const response = await api.get(`/artigos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar artigo ${id}:`, error);
    return null;
  }
}

export async function createArtigo(data) {
  try {
    const formData = new FormData();

    // Adicionar dados do artigo
    Object.keys(data).forEach((key) => {
      if (key === "autoresIds" || key === "palavrasChave") {
        formData.append(key, JSON.stringify(data[key]));
      } else if (key === "arquivo" && data[key]) {
        formData.append("arquivo", data[key]);
      } else {
        formData.append(key, data[key]);
      }
    });

    const response = await api.post("/artigos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar artigo:", error);
    throw error;
  }
}

// Avaliações
export async function getAvaliacoes(userId = null) {
  try {
    let endpoint = "/avaliacoes";

    if (userId) {
      endpoint = `/avaliadores/${userId}/artigos`;
    }

    const response = await api.get(endpoint);

    // Se for avaliações por avaliador, mapear para manter formato consistente
    if (userId && Array.isArray(response.data)) {
      return response.data.map((artigo) => ({
        id: artigo.avaliacao?.id || null,
        artigo_id: artigo.id,
        artigo_titulo: artigo.titulo,
        nota: artigo.avaliacao?.nota || null,
        observacao: artigo.avaliacao?.observacao || "",
        data_avaliacao: artigo.avaliacao?.data_avaliacao || null,
        avaliador_id: userId,
      }));
    }

    return response.data;
  } catch (error) {
    console.error("Falha ao buscar avaliações:", error);
    return [];
  }
}

export async function getAvaliacao(id) {
  try {
    const response = await api.get(`/avaliacoes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar avaliação ${id}:`, error);
    return null;
  }
}

export async function submitAvaliacao(data) {
  try {
    // Aqui assumimos que data contém versaoId, nota, observacao
    const { versaoId, nota, observacao, arquivo } = data;

    const formData = new FormData();
    formData.append("nota", nota);
    formData.append("observacao", observacao);

    if (arquivo) {
      formData.append("arquivo", arquivo);
    }

    const response = await api.post(
      `/versoes/${versaoId}/avaliacoes`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Erro ao enviar avaliação:", error);
    throw error;
  }
}

// Usuários
export async function getUsuarios() {
  try {
    const response = await api.get("/usuarios");
    return response.data;
  } catch (error) {
    console.error("Falha ao buscar usuários:", error);
    return [];
  }
}

export async function getUser() {
  const userCookie = Cookies.get("user");
  if (userCookie) {
    try {
      const user = JSON.parse(userCookie);
      console.log("user", user);
      return user;
    } catch (e) {
      console.error("Erro ao analisar cookie do usuário", e);
      return null;
    }
  }
  return null;
}

export async function getUsuario(id) {
  try {
    const response = await api.get(`/usuarios/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar usuário ${id}:`, error);
    return null;
  }
}

export async function createUsuario(data) {
  try {
    const response = await api.post("/usuarios", data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
}

// Comentários
export async function getComentariosByVersaoArtigo(versaoId) {
  try {
    const response = await api.get(`/versoes/${versaoId}/comentarios`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar comentários da versão ${versaoId}:`, error);
    return [];
  }
}

export async function createComentario(versaoId, descricao) {
  try {
    const response = await api.post(`/versoes/${versaoId}/comentarios`, {
      descricao,
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao criar comentário para versão ${versaoId}:`, error);
    throw error;
  }
}

// Login e autenticação básicos
export async function login(email, senha) {
  try {
    const response = await api.post("/auth/login", {
      email: email,
      senha: senha,
    });
    Cookies.set("user", JSON.stringify(response.data), { expires: 7 });
    return response.data;
  } catch (error) {
    console.error("Erro ao fazer login:", error);
    throw error;
  }
}

export function logout() {
  // Implementação simplificada
  console.log("Usuário deslogado");
}
