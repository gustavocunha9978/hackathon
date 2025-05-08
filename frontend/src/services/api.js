import axios from 'axios';

// Cria uma instância do Axios com configurações padrão
const api = axios.create({
  baseURL: 'https://api.exemplo.com', // Substitua pela URL base da sua API
  headers: {
    'Content-Type': 'application/json',
    // Caso precise de um token de autenticação, pode ser adicionado aqui
    // 'Authorization': `Bearer ${localStorage.getItem('token')}`
  },
});

// Interceptador para tratamento global de erros de resposta
api.interceptors.response.use(
  response => response, // Retorna a resposta sem modificações
  error => {
    console.error('Erro na requisição:', error); // Log do erro
    return Promise.reject(error); // Retorna o erro para o código que fez a requisição
  }
);

export default api;



// exemplo de requisição
//   const [data, setData] = useState(null);
// useEffect(() => {
//     async function fetchData() {
//       try {
//         const response = await api.get('/endpoint'); // Altere "/endpoint" para a sua rota
//         setData(response.data);
//       } catch (error) {
//         console.error('Erro ao buscar dados:', error);
//       }
//     }

//     fetchData();
//   }, []);