import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';

// Dados fictícios para login e cadastro
const fakeUser = {
  id: 1,
  name: "João Silva",
  cpf: "123.456.789-00",
  email: "joao.silva@example.com",
  phone: "(11) 98765-4321",
  cep: "12345-678",
  address: "Rua Exemplo, 123",
  houseNumber: "123",
  password: "senhaSegura123",
  confirmPassword: "senhaSegura123"
};

const fakePet = {
  id: 1,
  userId: 1,
  name: "Rex",
  breed: "Labrador",
  age: 3
};

const TestApp = () => {
  const [user, setUser] = useState(null);
  const [pet, setPet] = useState(null);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Função para simular o login
  const handleLogin = () => {
    if (email === fakeUser.email && password === fakeUser.password) {
      setUser(fakeUser);
      setIsLoggedIn(true);
      setMessage('Login bem-sucedido!');
    } else {
      setMessage('Credenciais inválidas');
    }
  };

  // Função para simular o cadastro do pet
  const handleAddPet = () => {
    if (user) {
      // Associando o pet ao usuário
      setPet(fakePet);
      setMessage('Pet cadastrado com sucesso!');
    } else {
      setMessage('Erro ao cadastrar pet');
    }
  };

  // Função para simular o cadastro do usuário
  const handleRegisterUser = () => {
    // Nesse exemplo, estamos simulando que o cadastro já foi feito com o fakeUser
    setUser(fakeUser);
    setMessage('Usuário cadastrado com sucesso!');
  };

  return (
    <View style={{ padding: 20 }}>
      {!isLoggedIn ? (
        <View>
          <Text>Login</Text>
          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <TextInput
            placeholder="Senha"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
          />
          <Button title="Login" onPress={handleLogin} />
          {message && <Text>{message}</Text>}
        </View>
      ) : (
        <View>
          <Text>Bem-vindo, {user.name}!</Text>
          <Button title="Cadastrar Pet" onPress={handleAddPet} />
          <Button title="Cadastrar Novo Usuário" onPress={handleRegisterUser} />
          {message && <Text>{message}</Text>}

          {pet && (
            <View>
              <Text>Pet Cadastrado</Text>
              <Text>Nome: {pet.name}</Text>
              <Text>Raça: {pet.breed}</Text>
              <Text>Idade: {pet.age} anos</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

export default TestApp;
