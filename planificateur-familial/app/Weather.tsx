import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WEATHER_API_KEY } from '@env';

const Weather = () => {
  const [searchCity, setSearchCity] = useState('Paris');
  const [displayCity, setDisplayCity] = useState('Paris');
  
  interface WeatherData {
    name: string;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
  }

  interface ForecastData {
    list: {
      dt: number;
      main: {
        temp: number;
      };
      weather: [{
        icon: string;
      }];
    }[];
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour chercher par ville
  const fetchWeatherData = async (cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      // Récupérer la météo actuelle
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!currentResponse.ok) {
        throw new Error('Impossible de récupérer la météo');
      }
      const currentData = await currentResponse.json();
      setWeatherData(currentData);
      // Mettre à jour le nom de la ville affichée seulement si la requête est réussie
      setDisplayCity(cityName);

      // Récupérer les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(cityName)}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!forecastResponse.ok) {
        throw new Error('Impossible de récupérer les prévisions');
      }
      const forecastData = await forecastResponse.json();
      console.log('Données de prévision reçues:', forecastData.list.length, 'périodes');
      setForecastData(forecastData);
    } catch (err) {
      setError('Impossible de trouver la météo pour cette ville');
      console.error('Erreur:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour utiliser la position actuelle
  const useCurrentLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        fetchWeatherData('Paris'); // Charger Paris par défaut
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      await fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
    } catch (err) {
      setError('Erreur de géolocalisation');
      fetchWeatherData('Paris'); // Charger Paris par défaut en cas d'erreur
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour récupérer la météo par coordonnées
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!currentResponse.ok) {
        throw new Error('Impossible de récupérer la météo');
      }
      const currentData = await currentResponse.json();
      setWeatherData(currentData);
      // Mettre à jour le nom de la ville affichée avec le nom retourné par l'API
      setDisplayCity(currentData.name);
      
      // Récupérer les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    } catch (error) {
      console.error('Erreur lors de la récupération des données météo:', error);
    }
  };

  // Obtenir les prévisions pour les 4 prochains jours
  const getNextDaysForecasts = () => {
    if (!forecastData) return [];
    
    const uniqueDays = forecastData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      if (!acc[dateStr] && date.getDate() > new Date().getDate()) {
        acc[dateStr] = item;
      }
      
      return acc;
    }, {});

    return Object.values(uniqueDays).slice(0, 4);
  };

  // Mémoiser les prévisions pour éviter des calculs inutiles
  const nextDaysForecasts = useMemo(() => getNextDaysForecasts(), [forecastData]);

  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      try {
        if (isMounted) {
          await fetchWeatherData('Paris');
        }
      } catch (error) {
        if (isMounted) {
          console.error('Erreur lors du chargement initial:', error);
          setError('Erreur lors du chargement initial des données');
        }
      }
    };
    
    loadInitialData();
    
    return () => {
      isMounted = false;
    };
  }, []);

  // Fonction pour obtenir les prévisions des 4 prochains jours
  const getGradientColors = (): [string, string] => {
    if (!weatherData || !weatherData.weather || !weatherData.weather[0]) {
      return ['#4880EC', '#019CAD']; // Dégradé par défaut
    }

    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case 'clear':
        return ['#4DA0B0', '#D39D38']; // Dégradé pour ciel clair
      case 'clouds':
        return ['#757F9A', '#D7DDE8']; // Dégradé pour nuageux
      case 'rain':
        return ['#616161', '#9BC5C3']; // Dégradé pour pluie
      case 'snow':
        return ['#E6DADA', '#274046']; // Dégradé pour neige
      case 'thunderstorm':
        return ['#232526', '#414345']; // Dégradé pour orage
      default:
        return ['#4880EC', '#019CAD']; // Dégradé par défaut
    }
  };

  // Obtenir l'URL de l'icône météo
  const getWeatherIconUrl = (icon: string) => {
    return `http://openweathermap.org/img/wn/${icon}@2x.png`;
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={getGradientColors()}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Barre de recherche */}
        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une ville..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchCity}
            onChangeText={(text) => {
              // N'accepte que les lettres, chiffres, espaces, tirets et apostrophes
              const sanitizedText = text.replace(/[^\wÀ-ÿ\s\-']/gi, '');
              setSearchCity(sanitizedText);
            }}
            onSubmitEditing={() => {
              if (searchCity.trim() !== '') {
                fetchWeatherData(searchCity);
              } else {
                setError('Veuillez entrer une ville valide');
              }
            }}
          />
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={useCurrentLocation}
          >
            <Ionicons name="location" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Message d'erreur si présent */}
        {error && (
          <Text style={styles.errorText}>{error}</Text>
        )}

        {/* Indicateur de chargement */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {/* ScrollView avec la météo */}
        <ScrollView 
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollViewContent}
          style={styles.scrollView}
          pagingEnabled={true}
          snapToInterval={160}
          decelerationRate="fast"
        >
          {/* Météo actuelle */}
          <View style={styles.weatherCard}>
            <Text style={styles.cityText}>{displayCity}</Text>
            {weatherData && (
              <>
                <Image 
                  source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }} 
                  style={styles.weatherIcon} 
                />
                <Text style={styles.tempText}>
                  {Math.round(weatherData.main.temp)}°C
                </Text>
              </>
            )}
          </View>

          {/* Prévisions des 4 prochains jours */}
          {nextDaysForecasts.map((forecast, index) => (
            <View key={forecast.dt} style={styles.weatherCard}>
              <Text style={styles.dateText}>
                {new Date(forecast.dt * 1000).toLocaleDateString('fr-FR', { weekday: 'long' })}
              </Text>
              <Image 
                source={{ uri: getWeatherIconUrl(forecast.weather[0].icon) }} 
                style={styles.weatherIcon} 
              />
              <Text style={styles.tempText}>
                {Math.round(forecast.main.temp)}°C
              </Text>
            </View>
          ))}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    height: 180, // Hauteur fixe pour le composant météo
    width: '100%',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: 'rgba(255,255,255,0.7)',
    borderWidth: 1,
    paddingHorizontal: 10,
    color: '#fff',
    fontSize: 16,
  },
  locationButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  errorText: {
    color: '#fff',
    backgroundColor: 'rgba(255,0,0,0.2)',
    padding: 5,
    borderRadius: 5,
    fontSize: 12,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 1,
  },
  weatherCard: {
    width: 150,
    height: 110,
    padding: 10,
    marginHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  cityText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  dateText: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 5,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginVertical: 5,
  },
  tempText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default Weather;