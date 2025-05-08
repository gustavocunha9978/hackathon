// api.js - Verifica e corrige a configuração do Axios
import axios from "axios";

// Cria uma instância do Axios com configurações corretas
// Verifique se a URL base corresponde exatamente à sua API
const api = axios.create({
  // A URL deve ser a mesma que você está usando no Insomnia
  baseURL: "http://localhost:3001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptador para mostrar mais informações durante o debug
api.interceptors.request.use(
  (config) => {
    console.log("Fazendo requisição para:", config.url);
    console.log("Com os dados:", config.data);
    return config;
  },
  (error) => {
    console.error("Erro na requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptador para tratamento de erros de resposta
api.interceptors.response.use(
  (response) => {
    console.log("Resposta recebida:", response.status);
    return response;
  },
  (error) => {
    console.error("Erro na resposta:", error);
    // Log mais detalhado para debug
    if (error.response) {
      console.error("Status do erro:", error.response.status);
      console.error("Dados do erro:", error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
