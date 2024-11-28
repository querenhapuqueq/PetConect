import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location'; // Para pegar a localização
import axios from 'axios'; // Para fazer requisições HTTP

const Maps = () => {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]); // Armazenar os pet shops próximos
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    // Função para pegar a localização do dispositivo
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permissão para acessar a localização foi negada');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
      fetchPetShops(location.coords.latitude, location.coords.longitude);
    };

    getLocation();
  }, []);

  // Função para buscar pet shops próximos usando a API do LocationIQ
  const fetchPetShops = async (latitude, longitude) => {
    const radius = 10000; // Raio de 5km de busca
    const query = 'pet+shop'; // Tipo de estabelecimento que estamos procurando
    const apiKey = 'pk.2c0168ebdde12651da2da0059397fb8c'; // Sua chave de API do LocationIQ

    try {
      const response = await axios.get(
        `https://us1.locationiq.com/v1/search.php`, {
          params: {
            q: query,
            lat: latitude,
            lon: longitude,
            radius: radius,
            key: apiKey,
            format: 'json',
          },
        }
      );

      if (response.data.length > 0) {
        setPlaces(response.data); // Armazenar os resultados na state
      } else {
        Alert.alert('Erro', 'Não foi possível encontrar pet shops próximos.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Ocorreu um erro ao buscar pet shops.');
    }
  };

  // Mensagem de erro ou loading
  let text = 'Esperando pela localização...';
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = `Latitude: ${location.latitude}, Longitude: ${location.longitude}`;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.info}>{text}</Text>
      {location ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {/* Marcador de localização do usuário */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Sua localização"
            description="Você está aqui!"
          />

          {/* Marcadores de pet shops próximos */}
          {places.map((place, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: parseFloat(place.lat),
                longitude: parseFloat(place.lon),
              }}
              title={place.display_name}
              description="Pet shop encontrado"
            />
          ))}
        </MapView>
      ) : (
        <Text>Carregando mapa...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  info: {
    position: 'absolute',
    top: 10,
    fontSize: 16,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    borderRadius: 5,
  },
});

export default Maps;
