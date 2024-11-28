import axios from 'axios';

// Configuração do axios para realizar a requisição do CEP
const api = axios.create({
  baseURL: 'https://viacep.com.br', // URL base do serviço de consulta de CEP
});

export default api;
