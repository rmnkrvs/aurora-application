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
      <View style={styles.cards}>
        <StatCard label='Sightings' value={String(stats.total)} />
        <StatCard label='Aurora seen' value={String(stats.seen)} />
        <StatCard label='Average KP' value={stats.averageKp !== null ? stats.averageKp.toFixed(0) : '-'} />
      </View>

      <Text variant='titleMedium'>Sightings by rating</Text>

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

    </ScrollView>

  );
}

const styles = StyleSheet.create({
  statsWrapper: {
    flex: 1,
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
});