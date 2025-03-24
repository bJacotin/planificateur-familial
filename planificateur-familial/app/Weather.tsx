import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Image, SafeAreaView, StatusBar, ScrollView } from 'react-native';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { WEATHER_API_KEY } from '@env';

const Weather = () => {
  const [searchCity, setSearchCity] = useState('');
  const [displayCity, setDisplayCity] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  interface Suggestion {
    name: string;
    country: string;
    lat: number;
    lon: number;
  }

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [forecastData, setForecastData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour chercher les suggestions
  const fetchSuggestions = async (query: string) => {
    try {
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}`
      );
      if (!response.ok) {
        throw new Error('Impossible de récupérer les suggestions');
      }
      const data = await response.json();
      
      // Filtrer les suggestions pour ne garder que celles qui contiennent le texte saisi
      const filteredSuggestions = data.filter((suggestion: Suggestion) => {
        const cityName = suggestion.name.toLowerCase();
        const queryLower = query.toLowerCase();
        return cityName.includes(queryLower);
      });

      // Trier les suggestions par ordre de longueur croissante
      const sortedSuggestions = filteredSuggestions.sort((a, b) => {
        return a.name.length - b.name.length;
      });

      // Filtrer pour ne garder qu'une seule ville par pays
      const uniqueSuggestions = sortedSuggestions.reduce((acc: Suggestion[], current: Suggestion) => {
        const existingCountry = acc.find(s => s.country === current.country);
        if (!existingCountry) {
          acc.push(current);
        }
        return acc;
      }, []);

      setSuggestions(uniqueSuggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des suggestions:', error);
    }
  };

  // Fonction pour sélectionner une suggestion
  const selectSuggestion = async (suggestion: Suggestion) => {
    setSearchCity(`${suggestion.name}, ${suggestion.country}`);
    setShowSuggestions(false);
    
    // Utiliser les coordonnées de la suggestion sélectionnée
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${suggestion.lat}&lon=${suggestion.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    if (!currentResponse.ok) {
      throw new Error('Impossible de récupérer la météo');
    }
    const currentData = await currentResponse.json();

    setWeatherData(currentData);
    setDisplayCity(suggestion.name);

    // Récupérer les prévisions
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${suggestion.lat}&lon=${suggestion.lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
    );
    if (!forecastResponse.ok) {
      throw new Error('Impossible de récupérer les prévisions');
    }
    const forecastData = await forecastResponse.json();
    setForecastData(forecastData);
  };

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
      setDisplayCity(cityName);

      // Récupérer les coordonnées de la ville
      const { lat, lon } = currentData.coord;
      
      // Récupérer les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
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

  // Fonction pour utiliser la localisation actuelle
  const useCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      
      setSearchCity('');
      setShowSuggestions(false);
      
      await fetchWeatherByCoords(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      setError('Impossible d\'obtenir la localisation');
      console.error('Erreur de localisation:', error);
    }
  };

  // Vérifier la permission de localisation au démarrage
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        const { status } = await Location.getForegroundPermissionsAsync();
        if (status === 'granted') {
          await useCurrentLocation();
        } else {
          await useCurrentLocation();
        }
      } catch (error) {
        console.error('Erreur lors de la vérification des permissions:', error);
      }
    };

    checkLocationPermission();
  }, []);

  // Fonction pour récupérer la météo par coordonnées
  const fetchWeatherByCoords = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!currentResponse.ok) {
        throw new Error('Impossible de récupérer la météo');
      }
      const currentData = await currentResponse.json();
      setWeatherData(currentData);
      setDisplayCity(currentData.name);
      
      // Récupérer les prévisions
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric&lang=fr`
      );
      if (!forecastResponse.ok) {
        throw new Error('Impossible de récupérer les prévisions');
      }
      const forecastData = await forecastResponse.json();
      setForecastData(forecastData);
    } catch (error) {
      setError('Erreur lors de la récupération des données météo');
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtenir les prévisions pour les 7 prochains jours à partir du lendemain
  const getNextDaysForecasts = () => {
    if (!forecastData) return [];
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    
    const uniqueDays = forecastData.list.reduce((acc, item) => {
      const date = new Date(item.dt * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      // Ne prendre que les jours après demain
      if (!acc[dateStr] && date >= tomorrow) {
        acc[dateStr] = item;
      }
      
      return acc;
    }, {});

    return Object.values(uniqueDays).slice(0, 6);
  };

  // Mémoiser les prévisions pour éviter des calculs inutiles
  const nextDaysForecasts = useMemo(() => getNextDaysForecasts(), [forecastData]);

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

  // Gérer les changements dans l'input
  const handleInputChange = (text: string) => {
    setSearchCity(text);
    if (text.length >= 2) {
      fetchSuggestions(text);
    } else {
      setShowSuggestions(false);
    }
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
            placeholder="Trouver une ville..."
            placeholderTextColor="rgba(255,255,255,0.7)"
            value={searchCity}
            onChangeText={handleInputChange}
            onSubmitEditing={() => {
              if (searchCity.trim() !== '') {
                fetchWeatherData(searchCity);
              } else {
                setError('Veuillez entrer une ville valide');
              }
            }}
          />
          <TouchableOpacity 
            style={styles.searchButton}
            onPress={() => {
              if (searchCity.trim() !== '') {
                fetchWeatherData(searchCity);
              }
            }}
          >
            <Ionicons name="search" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.locationButton}
            onPress={useCurrentLocation}
          >
            <Ionicons name="location" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Afficher les suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <ScrollView
              style={styles.suggestionsScroll}
              showsVerticalScrollIndicator={false}
            >
              {suggestions.map((suggestion, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => selectSuggestion(suggestion)}
                >
                  <Text style={styles.suggestionText}>
                    {suggestion.name}
                  </Text>
                  <Text style={styles.suggestionCountry}>
                    {suggestion.country}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

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
          {weatherData && (
            <View style={styles.weatherCard}>
              <Text style={styles.cityText}>{displayCity}</Text>
              <Image 
                source={{ uri: getWeatherIconUrl(weatherData.weather[0].icon) }} 
                style={styles.weatherIcon} 
              />
              <Text style={styles.tempText}>
                {Math.round(weatherData.main.temp)}°C
              </Text>
            </View>
          )}

          {/* Prévisions des 7 prochains jours */}
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
    height: 180, // Hauteur ajustée
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

  searchButton : {
    marginLeft:8,
    padding: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 5,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 10,
    padding: 5,
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxHeight: 130, // Hauteur ajustée pour s'adapter à la hauteur du composant
  },
  suggestionsScroll: {
    maxHeight: 130,
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  suggestionText: {
    color: '#333',
    fontSize: 16,
  },
  suggestionCountry: {
    color: '#666',
    fontSize: 14,
  },
});

export default Weather;