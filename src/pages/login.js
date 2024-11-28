import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button, Image, Alert } from 'react-native';
import { MaterialIcons, Octicons } from '@expo/vector-icons';
import axios from 'axios';  // Importando o axios para fazer a requisição HTTP

import Logo from '../assets/logo.png';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    // Função para lidar com o login
    const getLogin = async () => {
        setLoading(true);
        console.log("Tentando fazer login com:", email, password);

        try {
            // Substitua 'localhost' pelo IP da sua máquina (ex: '192.168.1.100')
            const response = await axios.post('http://192.168.1.18:3000/api/login', {  // Alterar para o IP local
                email,
                senha: password
            });

            console.log("Resposta do servidor:", response.data);

            if (response.status === 200) {
                setLoading(false);
                Alert.alert('Sucesso', 'Login realizado com sucesso!');
                navigation.navigate('Home'); // Vai para a tela Home
            }
        } catch (error) {
            setLoading(false);
            console.error("Erro na requisição:", error);
            if (error.response) {
                Alert.alert('Erro', error.response.data.erro); // Mensagem de erro vinda do backend
            } else {
                Alert.alert('Erro', 'Erro ao realizar o login');
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image source={Logo} style={styles.logo} resizeMode="contain" />
            
            <View style={styles.boxTop}></View>
            
            <View style={styles.boxMid}>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="ENDEREÇO E-MAIL"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <MaterialIcons name="email" size={24} color="black" />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="SENHA"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                    />
                    <Octicons
                        name={showPassword ? "eye-closed" : "eye"}
                        size={24}
                        color="black"
                        onPress={() => setShowPassword(!showPassword)}
                    />
                </View>
            </View>

            <View style={styles.boxBottom}>
                <Button title={loading ? "Carregando..." : "ENTRAR"} onPress={getLogin} disabled={loading} />
            </View>

            <Text style={styles.textBottom}>
                Não tem conta? 
                <Text style={styles.textBottomCreate} onPress={() => navigation.navigate('Cadastro')}>
                    Crie agora
                </Text>
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    boxTop: {
        marginBottom: 20,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boxMid: {
        marginBottom: 20,
    },
    logo: {
        width: 300,
        height: 150,
        marginTop: 40,
        alignSelf: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    input: {
        flex: 1,
        borderBottomWidth: 1,
        padding: 10,
        marginRight: 10,
    },
    boxBottom: {
        marginTop: 30,
    },
    textBottom: {
        textAlign: 'center',
        marginTop: 20,
    },
    textBottomCreate: {
        color: 'blue',
        fontWeight: 'bold',
    },
});