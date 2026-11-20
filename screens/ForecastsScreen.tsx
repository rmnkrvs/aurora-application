import { ScrollView, View, StyleSheet } from 'react-native';
import { Chip, Text, useTheme } from 'react-native-paper';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getKpForecast, getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo'
import { KpData, KpForecast, Weather } from '../types';
import describeKp from '../utils/kp';
import { formatForecastTime, getCurrentHourIndex, isDark, formatLocalTime } from '../utils/time';
import { useLocation } from '../hooks/location';
import { calculateAuroraScore } from '../utils/score';
import { buildForecast } from '../utils/forecasts';
import { getScoreMessage } from '../strings';
import { getMoonPhase } from '../utils/moon';

const IMAGE_HEIGHT = 350;
const OVERLAP = 120;

export default function ForecastsScreen() {

  const theme = useTheme();

  const [kp, setKp] = useState<KpData | null>(null);
  const [kpForecast, setKpForecast] = useState<KpForecast[] | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  const moon = weather ? getMoonPhase(weather.daily.moon_phase[0]) : null;

  const { location, city } = useLocation();

  const hourIndex = weather ? getCurrentHourIndex(weather.hourly.time) : 0;

  const dark = weather ? isDark(weather.daily.sunrise[0], weather.daily.sunset[0]) : false;

  const score = kp && weather && location
    ? calculateAuroraScore({
      kp: kp.estimated_kp,
      cloudCover: weather.hourly.cloud_cover[hourIndex],
      moonPhase: weather.daily.moon_phase[0],
      isDark: dark,
      latitude: location.latitude,
    })
    : null;

  // NOAA data starts with past measurements, use only future forecasts ('estimated' and 'predicted')
  const now = Date.now();
  const THREE_HOURS = 3 * 60 * 60 * 1000;
  const upcoming = kpForecast?.filter(row =>
    new Date(row.time_tag + 'Z').getTime() + THREE_HOURS > now
  ) ?? [];

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

  if (weather && location) {
  console.log(buildForecast(upcoming, weather, location.latitude));
}

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

          {city ? (
            <Text variant='bodyLarge'>{city}</Text>
          ) :
            <Text variant='bodyLarge'>Current location: Loading...</Text>}

          <Text variant='bodyLarge'>Estimated chance to see Aurora:</Text>

          {score !== null ?
            <Text variant='displayLarge'>{score}%</Text>
            :
            <Text>Calculating...</Text>}

          {score !== null && <Text>{getScoreMessage(score)}</Text>}

          {kp && weather && moon ? (
            <View style={styles.chips}>
              <Chip icon="flash">Kp {kp.estimated_kp.toFixed(0)}</Chip>
              <Chip icon="weather-cloudy">Clouds {weather.hourly.cloud_cover[hourIndex]}%</Chip>
              <Chip icon={moon.icon}>{moon.name}</Chip>
            </View>
          ) : (
            <Text>Loading data...</Text>
          )}

          {weather ? (
            <View>
              <Text>Sunrise: {formatLocalTime(weather.daily.sunrise[0])} - Sunset: {formatLocalTime(weather.daily.sunset[0])}</Text>
            </View>
          ) : (
            <Text>Loading data...</Text>
          )}

        </View>

      </ScrollView >

    </View >
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
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap', // wraps to a second line on a narrow screen
    gap: 8,
  },
});
