import { FlatList, StyleSheet, View, Alert } from 'react-native';
import { useState, useCallback } from 'react';
import { Sighting, TabScreenProps } from '../types';
import { deleteSighting, getSightings } from '../db/sightings';
import { useFocusEffect } from '@react-navigation/native';
import { RATINGS } from '../utils/ratings';
import { Card, Text, Chip, FAB, useTheme } from 'react-native-paper';

export default function SightingsScreen({ navigation }: TabScreenProps<'Sightings'>) {

  const [sightings, setSightings] = useState<Sighting[]>([]);

  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      getSightings()
        .then(setSightings)
        .catch(console.error);
    }, [])
  );

  const confirmDelete = (id: number) => {
    Alert.alert('Delete sighting?', 'This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteSighting(id);
          setSightings(await getSightings());
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>

      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <Text>No saved sightings yet</Text>
        }
        renderItem={({ item }) => (
          <Card style={styles.card} onLongPress={() => confirmDelete(item.id)}>
            {item.photoUri ? <Card.Cover source={{ uri: item.photoUri }} /> : null}
            <Card.Title
              title={RATINGS.find(r => r.value === item.rating)?.label}
              subtitle={new Date(item.timestamp).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })}
            />
            <Card.Content style={{ gap: 8 }}>
              {item.note ? <Text variant="bodyMedium">{item.note}</Text> : null}
              <View style={styles.chips}>
                <Chip icon="weather-night">Kp {item.kpIndex.toFixed(1)}</Chip>
                <Chip icon="cloud-outline">{Math.round(item.cloudCover)} %</Chip>
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddSighting')}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  chips: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  card: { marginBottom: 12 },
});