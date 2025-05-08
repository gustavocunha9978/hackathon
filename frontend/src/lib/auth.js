// auth.js - Implementação utilizando localStorage para autenticação

import { createUsuario, getUsuarios } from "./api";

// Função de utilidade para simular delay nas operações
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Função para validar credenciais
async function validateCredentials(email, password) {
  const usuarios = await getUsuarios();
  const usuario = usuarios.find((u) => u.email === email);

  if (!usuario) {
    throw new Error("Usuário não encontrado");
  }

  // Em um sistema real, verificaríamos o hash da senha
  // Para simplificar, assumiremos que qualquer senha é válida neste mock

  return usuario;
}

// Função para fazer login
export async function login(email, password) {
  try {
    await delay(500);

    // Valida as credenciais
    const usuario = await validateCredentials(email, password);

    // Determina a role primária do usuário (para redirecionamento)
    let role = "autor";
    if (usuario.cargos.includes("coordenador")) {
      role = "coordenador";
    } else if (usuario.cargos.includes("avaliador")) {
      role = "avaliador";
    }

    // Cria o objeto de usuário para a sessão
    const user = {
      id: usuario.id,
      name: usuario.nome,
      email: usuario.email,
      role,
    };

    // Armazena no localStorage
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", "token-simulado");

    return user;
  } catch (error) {
    throw new Error("Credenciais inválidas");
  }
}

// Função para criar um novo usuário
export async function createUserAccount(data) {
  try {
    // Cria o usuário usando a função do API
    const newUser = await createUsuario({
      nome: data.nome,
      email: data.email,
      data_nascimento: data.dataNascimento,
      cargos: data.cargos || ["autor"], // Por padrão, novos usuários são autores
    });

    return newUser;
  } catch (error) {
    throw new Error("Erro ao criar usuário: " + error.message);
  }
}

// Função para fazer logout
export function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");

  // Em uma aplicação real, redirecionaríamos para a página de login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
}

// Função para obter o usuário atual
export function getUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error("Erro ao analisar dados do usuário", e);
      return null;
    }
  }
  return null;
}

// Função para verificar se o usuário está autenticado
export function isAuthenticated() {
  if (typeof window === "undefined") {
    return false;
  }

  return !!localStorage.getItem("token") && !!getUser();
}

// Função para verificar se o usuário tem determinado papel
export function hasRole(requiredRole) {
  const user = getUser();
  return user && user.role === requiredRole;
}

// Função para atualizar dados do usuário
export async function updateUserProfile(userId, userData) {
  // Implementar quando necessário
}
