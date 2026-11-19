import { ScrollView, View, StyleSheet, useWindowDimensions } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getKpForecast, getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo'
import { KpData, KpForecast, Weather } from '../types';
import describeKp from '../utils/kp';
import { useLocation } from '../hooks/location';

const IMAGE_HEIGHT = 350;
const OVERLAP = 120;

export default function ForecastsScreen() {

  const theme = useTheme();

  const [kp, setKp] = useState<KpData | null>(null);
  const [kpForecast, setKpForecast] = useState<KpForecast[] | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null)

  const location = useLocation();

  useEffect(() => {
    getLatestKp()
      .then(setKp)
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    getKpForecast()
      .then(setKpForecast)
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  useEffect(() => {
    if (!location) return;
    getWeather(location.latitude, location.longitude)
      .then(setWeather)
      .catch(error => console.error('Error fetching data:', error));
  }, [location]);

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Image
        source={require('../assets/revontuli-vaaka.jpg')}
        style={styles.hero}
        contentFit="cover"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        contentContainerStyle={{ flexGrow: 1, paddingTop: IMAGE_HEIGHT - OVERLAP }}
      >
        <View style={[
          styles.sheet,
          {
            backgroundColor: theme.colors.surface,
          },
        ]}
        >

          {kp ? (
            <Text>Testing KP: {kp.estimated_kp}</Text>
          ) : (
            <Text>Loading data...</Text>
          )}

          <Text>{describeKp(kp?.estimated_kp || 0)}</Text>

          {kpForecast ? (
            <Text>Testing KP Forecast: {kpForecast[0]?.kp_forecast}</Text>
          ) : (
            <Text>Loading data...</Text>
          )}

          {weather ? (
            <Text>Testing weather data / Sunset: {weather.daily.sunset[0]}</Text>
          ) : (
            <Text>Loading data...</Text>
          )}

        </View>

      </ScrollView>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: IMAGE_HEIGHT,
  },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 16,
    gap: 16,
  },
});
