import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Alert } from 'react-native';  // Para exibir alertas de erro ou sucesso

// Importando as telas
import Login from './src/pages/login'; // Tela de Login
import Cadastro from './src/pages/cadastro'; // Tela de Cadastro
import Home from './src/pages/home'; // Tela Home
import Perfil from './src/pages/perfil'; // Tela Perfil
import Maps from './src/pages/maps'; // Tela Maps
import { registerUser } from './src/services/authService';  // Importe sua função de cadastro

// Criando os navegadores de Stack e Tab
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Navegação por abas (Home, Maps, Perfil)
function TabNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false, // Escondendo o cabeçalho das tabs
      }}
    >
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Maps"
        component={Maps}
        options={{
          tabBarLabel: 'Maps',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="map" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Perfil"
        component={Perfil}
        options={{
          tabBarLabel: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Função principal de navegação (App.js)
export default function App() {
  const [userData, setUserData] = useState(null);

  // Função para lidar com o cadastro de usuário
  const handleRegister = async (userInfo, navigation) => {
    try {
      const response = await registerUser(userInfo);  // Supondo que você tenha uma função de cadastro
      // Se o cadastro for bem-sucedido, navegue para a tela de Home
      setUserData(response.user);
      Alert.alert('Cadastro', 'Usuário registrado com sucesso!');
      // Navegação para a tela Home (com navegação por tabs)
      navigation.replace('Home');  // Usando `replace` para evitar que a tela de cadastro fique no histórico de navegação
    } catch (error) {
      Alert.alert('Erro no Cadastro', error.message);
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Tela de login */}
        <Stack.Screen 
          name="Login" 
          component={Login} 
          options={{ headerShown: false }} // Ocultar o header na tela de login
        />

        {/* Tela de cadastro */}
        <Stack.Screen name="Cadastro">
          {(props) => (
            <Cadastro 
              {...props} 
              onRegister={(userInfo) => handleRegister(userInfo, props.navigation)} 
            />
          )}
        </Stack.Screen>

        {/* Tela Home com navegação por tabs */}
        <Stack.Screen
          name="Home"
          component={TabNavigator}  // TabNavigator é passado como componente para o Stack
          options={{ headerShown: false }} // Esconder o header na tela de Home (já é gerenciado pelas tabs)
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
