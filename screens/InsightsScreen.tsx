import { useCallback, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';
import { getSightings } from '../db/sightings';
import { Sighting } from '../types';
import { calculateStats } from '../utils/stats';
import { RATINGS } from '../utils/ratings';

const BAR_AREA_HEIGHT = 120;

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.statsWrapper}>
      <Card>
        <Card.Content style={styles.cardContent}>
          <Text variant='headlineMedium'>{value}</Text>
          <Text variant='labelMedium' style={styles.centered}>{label}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

export default function InsightsScreen() {

  const theme = useTheme();
  const [sightings, setSightings] = useState<Sighting[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSightings()
        .then(setSightings)
        .catch(error => console.error('Error loading sightings:', error));
    }, [])
  );

  if (sightings.length === 0) {
    return (
      <View style={[styles.empty, { backgroundColor: theme.colors.background }]}>
        <Text variant='titleMedium' style={styles.centered}>No sightings yet</Text>
        <Text variant='bodyMedium' style={styles.centered}>
          Add a sighting to see your stats here.
        </Text>
      </View>
    );
  }

  const stats = calculateStats(sightings);

  const maxCount = Math.max(...stats.countsByRating, 1);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.content}
    >

      <Text variant="bodyMedium" style={styles.intro}>
        Every sighting you save is stored on this device. Here you can see how
        often you have seen the aurora and how well the forecast matched what
        you saw.
      </Text>

      <Text variant="titleMedium">Overview</Text>
      <View style={styles.cards}>
        <StatCard label='Total of sightings reported' value={String(stats.total)} />
        <StatCard label='Aurora seen during sightings' value={String(stats.seen)} />
        <StatCard label='Average KP when seen auroras' value={stats.averageKp !== null ? stats.averageKp.toFixed(1) : '-'} />
        <StatCard label='Average forecast score when seen' value={stats.averageScore !== null ? `${Math.round(stats.averageScore)} %` : '-'} />
      </View>

      <Text variant='titleMedium'>How were your sightings?</Text>

      <View style={styles.bars}>
        {RATINGS.map(rating => {
          const count = stats.countsByRating[rating.value];

          return (
            <View key={rating.value} style={styles.barColumn}>
              <Text variant='labelLarge'>{count}</Text>

              <View style={styles.barArea}>
                <View
                  style={{
                    width: 40,
                    height: Math.max(4, (count / maxCount) * BAR_AREA_HEIGHT),
                    backgroundColor: rating.value === 0 ? theme.colors.outline : theme.colors.primary,
                    borderRadius: 6,
                  }}
                />
              </View>

              <Text variant='labelMedium'>{rating.label}</Text>
            </View>
          );
        })}
      </View>

      <Text variant="bodySmall" style={styles.hint}>
        Forecast score is the chance estimate the app showed when you saved the
        sighting. If it is usually high when you see the aurora, the estimate
        works well for your location.
      </Text>

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  statsWrapper: {
    width: '47%',
    flexGrow: 1,
  },
  cardContent: {
    alignItems: 'center',
  },
  content: {
    padding: 16,
    gap: 24,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 8,
  },
  centered: {
    textAlign: 'center',
  },
  cards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statCard: {
    flex: 1,
  },
  statContent: {
    alignItems: 'center',
    gap: 4,
  },
  bars: {
    flexDirection: 'row',
    gap: 12,
  },
  barColumn: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  barArea: {
    height: BAR_AREA_HEIGHT,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  intro: {
    opacity: 0.8,
    marginTop: 4,
  },
  hint: {
    opacity: 0.7,
    marginBottom: 8,
  },
});