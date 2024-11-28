export const registerUser = async (data) => {
    try {
      // Exibindo um indicador de carregamento enquanto a requisição está em andamento
      console.log('Iniciando o registro...');
  
      const response = await fetch('http://localhost:3000/api/cadastrar', { // IP correto
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      // Se a resposta não for OK, lança um erro
      if (!response.ok) {
        const errorDetails = await response.text(); // Obter detalhes do erro se existirem
        throw new Error(`Erro: ${response.statusText} - ${errorDetails}`);
      }
  
      // Processar a resposta da API
      const responseData = await response.json();
      console.log('Usuário cadastrado:', responseData);
  
      return responseData;
  
    } catch (error) {
      // Exibir erro detalhado para o desenvolvedor
      console.error('Erro ao cadastrar usuário:', error.message);
  
      // Exibindo erro amigável para o usuário
      throw new Error('Erro ao cadastrar usuário. Tente novamente mais tarde.');
    }
  };
  