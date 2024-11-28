import React from 'react';
import { ScrollView, View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import Swiper from 'react-native-swiper'; // Importando o Swiper

// Imagens fictícias para os banners (substitua com suas imagens reais)
import banner1 from '../assets/banner1.jpg';  // Certifique-se de que as imagens existam nesse caminho
import banner2 from '../assets/banner2.jpg';  // Certifique-se de que as imagens existam nesse caminho

// Imagens corrigidas para os serviços
import hotelImage from '../assets/home.png';  // Ajuste a extensão correta se necessário
import petshopImage from '../assets/shop.png';
import medicoImage from '../assets/doc.png';

// Imagem da logo
import logo from '../assets/log.png';  // Adicione a logo no seu diretório de assets

export default function Home({ navigation }) {
  // Função para mostrar a localização do serviço (exemplo de navegação ou alerta)
  const showServiceLocation = (serviceName) => {
    Alert.alert(`Você clicou em ${serviceName}`, `Aqui estão os detalhes sobre o ${serviceName}`);
    // Aqui você pode colocar a navegação ou detalhes específicos para cada serviço.
  };

  return (
    <ScrollView style={styles.container}>
      {/* Nome e logo */}
      <View style={styles.header}>
        <Image source={logo} style={styles.logo} />
        <Text style={styles.headerText}>PetConect</Text>
      </View>

      {/* Carrossel de banners */}
      <Swiper style={styles.wrapper} showsButtons={false} loop={true} autoplay={true}>
        <View style={styles.carouselItem}>
          <Image source={banner2} style={styles.carouselImage} />
        </View>
        <View style={styles.carouselItem}>
          <Image source={banner1} style={styles.carouselImage} />
        </View>
      </Swiper>

      {/* Texto sobre o projeto */}
      <View style={styles.projectInfo}>
        <Text style={styles.projectTitle}>Sobre o Projeto</Text>
        <Text style={styles.projectDescription}>
          Este aplicativo foi criado para proporcionar aos donos de pets uma forma fácil e eficiente de cuidar do bem-estar dos seus animais. 
          Oferecemos uma série de serviços essenciais, como hospedagem de qualidade em hotel para pets, cuidados especializados em petshop e 
          atendimento veterinário de excelência. Tudo isso pensado para garantir o conforto e a saúde do seu pet.
        </Text>
      </View>

      <Text style={styles.title}>Serviços Disponíveis</Text>

      {/* Hotel para Pets */}
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => showServiceLocation('Hotel para Pets')}
      >
        <Image source={hotelImage} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Hotel para Pets</Text>
        <Text style={styles.serviceDescription}>Hospedagem de qualidade para seu pet!</Text>
      </TouchableOpacity>

      {/* PetShop */}
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => showServiceLocation('PetShop')}
      >
        <Image source={petshopImage} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>PetShop</Text>
        <Text style={styles.serviceDescription}>Produtos e cuidados para seu pet.</Text>
      </TouchableOpacity>

      {/* Médico para Pets */}
      <TouchableOpacity
        style={styles.serviceCard}
        onPress={() => showServiceLocation('Médico para Pets')}
      >
        <Image source={medicoImage} style={styles.serviceImage} />
        <Text style={styles.serviceTitle}>Médico para Pets</Text>
        <Text style={styles.serviceDescription}>Consultas e cuidados veterinários especializados.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  header: {
    height: 80,  // Altura ajustada para acomodar a logo e o texto
    flexDirection: 'row',  // Logo e texto lado a lado
    alignItems: 'center',  // Alinha ao centro
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  logo: {
    width: 60,  // Tamanho da logo ajustado
    height: 60,  // Tamanho da logo ajustado
    marginRight: 15,  // Espaço entre a logo e o texto
  },
  headerText: {
    fontSize: 30,  // Tamanho do texto ajustado
    fontWeight: 'bold',
    color: '#003366',  // Cor azul escuro
    flex: 1,  // Garante que o texto ocupe o espaço restante
  },
  wrapper: {
    marginBottom: 20,
    height: 250,  // A altura do carrossel
  },
  carouselItem: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  carouselImage: {
    width: '100%',
    height: 230,  // Altura da imagem do carrossel
    borderRadius: 10,
    resizeMode: 'cover',
  },
  projectInfo: {
    marginVertical: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
  },
  projectTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  projectDescription: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  serviceCard: {
    backgroundColor: '#fff',
    marginBottom: 20,
    borderRadius: 10,
    elevation: 3,
    padding: 10,
  },
  serviceImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
  },
  serviceDescription: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 5,
    color: '#555',
  },
});
