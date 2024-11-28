import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Perfil({ navigation }) {
  const [usuario, setUsuario] = useState(null);

  // Recupera os dados do usuário ao carregar a tela
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('usuario');
        if (storedUser) {
          setUsuario(JSON.parse(storedUser));  // Define o estado com os dados do usuário
        } else {
          Alert.alert('Erro', 'Usuário não encontrado. Faça login novamente.');
          navigation.navigate('Login');
        }
      } catch (error) {
        console.error('Erro ao carregar os dados do usuário:', error);
        Alert.alert('Erro', 'Não foi possível carregar os dados do usuário.');
      }
    };

    loadUserData();
  }, []);

  // Função para logout
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('usuario');  // Remove os dados do usuário no logout
      navigation.navigate('Login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      Alert.alert('Erro', 'Não foi possível fazer logout.');
    }
  };

  if (!usuario) {
    return <Text>Carregando...</Text>;  // Exibe um texto de carregamento enquanto os dados estão sendo carregados
  }

  return (
    <View style={styles.container}>
      {/* Cabeçalho com a curva de onda */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Perfil</Text>
      </View>

      {/* Informações do Usuário */}
      <View style={styles.profileInfo}>
        <Text style={styles.label}>Nome: {usuario.nome}</Text>
        <Text style={styles.label}>Email: {usuario.email}</Text>
        <Text style={styles.label}>Telefone: {usuario.telefone}</Text>
      </View>

      {/* Botão de Logout */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8', // Cor de fundo do app
  },
  header: {
    backgroundColor: '#003366',  // Azul escuro
    height: 250,  // Cabeçalho grande
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
  },
  profileInfo: {
    padding: 20,
    backgroundColor: '#fff',
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 3,  // Sombra para dar um efeito de profundidade
    marginBottom: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  logoutButton: {
    backgroundColor: '#D9534F',  // Vermelho suave
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 25,
    alignSelf: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
