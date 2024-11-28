import React, { useState } from 'react';
import { Text, View, TextInput, Alert, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { Octicons } from '@expo/vector-icons'; // Importando ícone de olho
import axios from 'axios'; // Importando a biblioteca axios
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Cadastro({ navigation }) {
  // Estados do cadastro de usuário
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [cep, setCep] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [carregando, setCarregando] = useState(false);
  
  // Estado dos pets
  const [pets, setPets] = useState([{ nome: '', especie: '', raca: '', idade: '', genero: 'Macho' }]);  // Começa com um pet

  // Função para buscar o endereço pelo CEP
  const handleCepSearch = async (cep) => {
    if (cep.length === 8) {
      try {
        const response = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
        if (response.data && !response.data.erro) {
          setRua(response.data.logradouro); // Preenchendo o campo rua com o retorno da API
        } else {
          Alert.alert('Erro', 'CEP não encontrado!');
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Erro', 'Falha ao buscar o CEP');
      }
    }
  };

  // Função para adicionar um novo pet ao estado
  const handleAddPet = () => {
    setPets([...pets, { nome: '', especie: '', raca: '', idade: '', genero: 'Macho' }]);
  };

  // Função para remover um pet
  const handleRemovePet = (index) => {
    const updatedPets = pets.filter((_, i) => i !== index);
    setPets(updatedPets);
  };

  // Função para lidar com o envio do formulário
  const handleRegister = async () => {
    // Verifica se as senhas coincidem antes de enviar ao backend
    if (senha !== confirmarSenha) {
      Alert.alert('Erro', 'As senhas não coincidem!');
      return;
    }
  
    setCarregando(true);
  
    // Dados do usuário
    const dadosUsuario = {
      nome,
      cpf,
      telefone,
      email,
      rua,
      numero,
      cep,
      senha, // Senha única
      confirmarSenha, // Confirmar senha removido do backend
      pets, // Enviando pets junto com os dados do usuário
    };

    try {
      // Envia dados para o backend
      const response = await axios.post('http://192.168.1.18:3000/api/cadastrar', dadosUsuario);
  
      if (response.status === 200 || response.status === 201) {
        // Armazena os dados do usuário no AsyncStorage
        await AsyncStorage.setItem('usuario', JSON.stringify(dadosUsuario));

        Alert.alert('Sucesso', 'Conta criada com sucesso!');
        navigation.navigate('Home');
      } else {
        Alert.alert('Erro', response.data.erro || 'Não foi possível cadastrar. Tente novamente.');
      }
    } catch (error) {
      console.error('Erro ao cadastrar:', error.message || error.response);
      Alert.alert('Erro', 'Não foi possível cadastrar. Tente novamente.');
    } finally {
      setCarregando(false); // Finaliza o carregamento independentemente do sucesso ou falha
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Criar Conta</Text>

        {/* Formulário de cadastro */}
        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
          <TextInput style={styles.input} placeholder="CPF" value={cpf} onChangeText={setCpf} keyboardType="numeric" />
          <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
          <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={setEmail} />

          {/* Endereço */}
          <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
          <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
          <TextInput
            style={styles.input}
            placeholder="CEP"
            value={cep}
            onChangeText={(text) => {
              setCep(text);
              handleCepSearch(text); // Chama a função de busca de CEP quando o texto mudar
            }}
            keyboardType="numeric"
          />

          {/* Senha */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}  // Ajusta o tamanho do campo de senha
              placeholder="Senha"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!mostrarSenha}
            />
            <Octicons
              name={mostrarSenha ? "eye-closed" : "eye"}
              size={24}
              color="#666"
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.showPasswordButton}
            />
          </View>

          {/* Confirmar Senha */}
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}  // Ajusta o tamanho do campo de confirmação de senha
              placeholder="Confirmar Senha"
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!mostrarSenha}
            />
            <Octicons
              name={mostrarSenha ? "eye-closed" : "eye"}
              size={24}
              color="#666"
              onPress={() => setMostrarSenha(!mostrarSenha)}
              style={styles.showPasswordButton}
            />
          </View>

          {/* Formulário dos Pets */}
          <Text style={styles.subtitle}>Cadastro de Pets</Text>
          {pets.map((pet, index) => (
            <View key={index} style={styles.petContainer}>
              <TextInput
                style={styles.input}
                placeholder="Nome do Pet"
                value={pet.nome}
                onChangeText={(text) => {
                  const updatedPets = [...pets];
                  updatedPets[index].nome = text;
                  setPets(updatedPets);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Espécie"
                value={pet.especie}
                onChangeText={(text) => {
                  const updatedPets = [...pets];
                  updatedPets[index].especie = text;
                  setPets(updatedPets);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Raça"
                value={pet.raca}
                onChangeText={(text) => {
                  const updatedPets = [...pets];
                  updatedPets[index].raca = text;
                  setPets(updatedPets);
                }}
              />
              <TextInput
                style={styles.input}
                placeholder="Idade"
                value={pet.idade}
                onChangeText={(text) => {
                  const updatedPets = [...pets];
                  updatedPets[index].idade = text;
                  setPets(updatedPets);
                }}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Gênero"
                value={pet.genero}
                onChangeText={(text) => {
                  const updatedPets = [...pets];
                  updatedPets[index].genero = text;
                  setPets(updatedPets);
                }}
              />
              <TouchableOpacity onPress={() => handleRemovePet(index)}>
                <Text style={styles.removePetText}>Remover Pet</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity onPress={handleAddPet}>
            <Text style={styles.addPetText}>Adicionar Outro Pet</Text>
          </TouchableOpacity>
        </View>

        {/* Botão de cadastro */}
        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
          {carregando ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Criar Conta</Text>
          )}
        </TouchableOpacity>

        {/* Texto de navegação */}
        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#003366',
    textAlign: 'center',
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#003366',
    marginVertical: 20,
  },
  formContainer: {
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  showPasswordButton: {
    position: 'absolute',
    right: 10,
  },
  passwordInput: {
    flex: 1, // Para garantir que o campo de senha ocupe toda a largura
  },
  petContainer: {
    marginBottom: 20,
  },
  addPetText: {
    color: '#003366',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  removePetText: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#003366',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    color: '#003366',
    fontWeight: 'bold',
  },
});
