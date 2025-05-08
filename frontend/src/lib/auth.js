import Cookies from "js-cookie";

export function login(email, password) {
  // Simula uma autenticação (em produção isso seria feito via API)
  return new Promise((resolve, reject) => {
    // Simula uma verificação
    if (email && password) {
      const user = {
        id: "1",
        name: "Usuário Teste",
        email: email,
        role: email.includes("admin")
          ? "coordenador"
          : email.includes("avaliador")
          ? "avaliador"
          : "autor",
      };

      // Salva no cookie

      Cookies.set("token", "token-simulado", { expires: 7 });

      resolve(user);
    } else {
      reject(new Error("Credenciais inválidas"));
    }
  });
}

export function createUsuario(data) {
  // Simula a criação de um usuário (em produção isso seria feito via API)
  return new Promise((resolve, reject) => {
    try {
      // Simula um pequeno delay
      setTimeout(() => {
        const newUser = {
          id: Math.floor(Math.random() * 1000) + 1,
          name: data.nome,
          email: data.email,
          role: "autor", // Por padrão, novos usuários são autores
        };

        resolve(newUser);
      }, 800);
    } catch (error) {
      reject(new Error("Erro ao criar usuário"));
    }
  });
}

export function logout() {
  Cookies.remove("user");
  Cookies.remove("token");
  window.location.href = "/login";
}

export function getUser() {
  const userCookie = Cookies.get("user");
  c;
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

export function isAuthenticated() {
  return !!Cookies.get("token") && !!getUser();
}

export function hasRole(requiredRole) {
  const user = getUser();
  return user && user.role === requiredRole;
}
