import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getKpForecast, getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo'
import { KpData, KpForecast, Weather } from '../types';
import describeKp from '../utils/kp';
import { useLocation } from '../hooks/location';

export default function ForecastsScreen() {

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
    <View style={styles.container}>
      
      {kp ? (
        <Text>Kp: {kp.estimated_kp}</Text>
      ) : (
        <Text>Loading data...</Text>
      )}

      <Text>{describeKp(kp?.estimated_kp || 0)}</Text>

      {kpForecast ? (
        <Text>Kp Forecast: {kpForecast[0]?.kp}</Text>
      ) : (
        <Text>Loading data...</Text>
      )}

      {weather ? (
        <Text>Sunset: {weather.daily.sunset[0]}</Text>
      ) : (
        <Text>Loading data...</Text>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
