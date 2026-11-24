import { ScrollView, View, StyleSheet } from 'react-native';
import { Chip, Text, useTheme, IconButton } from 'react-native-paper';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { getKpForecast, getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo'
import { KpData, KpForecast, Weather } from '../types';
import { getCurrentHourIndex, isDark, formatLocalTime, getNextSun } from '../utils/time';
import { useLocation } from '../hooks/location';
import { buildForecast } from '../utils/forecasts';
import { getScoreMessage } from '../strings';
import { getMoonPhase } from '../utils/moon';
import ScoreInfoDialog from '../components/ScoreInfoDialog';
import HourlyForecast from '../components/HourlyForecast';
import DailyForecast from '../components/DailyForecast';
import { summarizeDays } from '../utils/forecasts';
import { calculateScore, getScoreLevel } from '../utils/score';

const IMAGE_HEIGHT = 450;
const OVERLAP = 200;

export default function ForecastsScreen() {

  const theme = useTheme();

  const [kp, setKp] = useState<KpData | null>(null);
  const [kpForecast, setKpForecast] = useState<KpForecast[] | null>(null);
  const [weather, setWeather] = useState<Weather | null>(null);

  const [visible, setVisible] = useState(false);

  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const moon = weather ? getMoonPhase(weather.daily.moon_phase[0]) : null;

  const { location, city } = useLocation();

  const hourIndex = weather ? getCurrentHourIndex(weather.hourly.time) : 0;

  const dark = weather ? isDark(weather.daily.sunrise[0], weather.daily.sunset[0]) : false;

  const details = kp && weather && location
    ? calculateScore({
      kp: kp.estimated_kp,
      cloudCover: weather.hourly.cloud_cover[hourIndex],
      moonPhase: weather.daily.moon_phase[0],
      isDark: dark,
      latitude: location.latitude,
    })
    : null;

  const score = details?.score ?? null;

  // NOAA data starts with past measurements, use only future forecasts ('estimated' and 'predicted')
  const now = Date.now();
  const THREE_HOURS = 3 * 60 * 60 * 1000;
  const upcoming = kpForecast?.filter(row =>
    new Date(row.time_tag + 'Z').getTime() + THREE_HOURS > now
  ) ?? [];

  const forecast = kpForecast && weather && location
    ? buildForecast(upcoming, weather, location.latitude)
    : [];

  const days = summarizeDays(forecast);

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

  const sunEvent = weather ? getNextSun(weather.daily) : null;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <Image
        source={require('../assets/aurora-2000x1331.jpeg')}
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

          <View style={styles.header}>

          {city ? (
            <Text variant='titleMedium'>{city}</Text>
          ) :
            <Text variant='bodyLarge'>Current location: Loading...</Text>}

          <View style={styles.row}>
            <Text variant='labelLarge'>Estimated chance to see Aurora</Text>
            <IconButton
              icon='information-outline'
              size={18}
              onPress={showDialog}
              style={styles.info}
              accessibilityLabel='How is this calculated?'
            />
          </View>

          {score !== null ?
            <Text variant='displayLarge' style={{ fontFamily: 'Outfit_600SemiBold', color: getScoreLevel(score, theme).color }}>{score}%</Text>
            :
            <Text>Calculating...</Text>}

          {score !== null && <Text variant='titleMedium'>{getScoreMessage(score)}</Text>}
          </View>

          {kp && weather && moon && sunEvent ? (
            <View style={styles.chips}>
              <Chip icon='flash'>Kp {kp.estimated_kp.toFixed(0)}</Chip>
              <Chip icon='weather-cloudy'>Clouds {weather.hourly.cloud_cover[hourIndex]} %</Chip>
              <Chip icon={moon.icon}>{moon.name}</Chip>
              <Chip icon={sunEvent.type === 'sunrise' ? 'weather-sunset-up' : 'weather-sunset-down'}>{sunEvent.type === 'sunrise' ? 'Sunrise' : 'Sunset'} {formatLocalTime(sunEvent.time)}</Chip>
            </View>
          ) : (
            <Text>Loading data...</Text>
          )}

          <Text variant='titleMedium'>Next hours</Text>
          <HourlyForecast slots={forecast.slice(0, 8)} />

          <Text variant='titleMedium'>Next days</Text>
          <DailyForecast days={days} />

        </View>

      </ScrollView>

      {
        details && kp && weather && moon && (
          <ScoreInfoDialog
            visible={visible}
            onDismiss={hideDialog}
            details={details}
            kp={kp.estimated_kp}
            cloudCover={weather.hourly.cloud_cover[hourIndex]}
            isDark={dark}
            moonName={moon.name}
          />
        )
      }

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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  info: {
    margin: 0,
  },
  header: {
  gap: 4,
},
muted: {
  opacity: 0.7,
},
});
