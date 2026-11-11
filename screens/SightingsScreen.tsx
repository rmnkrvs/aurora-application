import { Button, FlatList, StyleSheet, Text, View, Image } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { Sighting, TabScreenProps } from '../types';
import { getSightings } from '../db/sightings';
import { useFocusEffect } from '@react-navigation/native';
import { RATINGS } from '../utils/ratings';

export default function SightingsScreen({ navigation }: TabScreenProps<'Sightings'>) {

  const [sightings, setSightings] = useState<Sighting[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSightings()
        .then(setSightings)
        .catch(console.error);
    }, [])
  );

  return (
    <View style={styles.container}>
      <Button
        onPress={() => navigation.navigate('AddSighting')} title="Add Sighting" />

      <FlatList
        data={sightings}
        keyExtractor={(item) => item.id.toString()}
        ListEmptyComponent={
          <Text>No saved sightings yet</Text>
        }
        renderItem={({ item }) => (
          <View>
            <Text>Date: {new Date(item.timestamp).toLocaleString('fi-FI')}</Text>
            <Text>Rating: {RATINGS.find(r => r.value === item.rating)?.label}</Text>
            <Text>Note: {item.note}</Text>
            {item.photoUri ? (
              <Image source={{ uri: item.photoUri }} style={{ width: 100, height: 100 }} />
            ) : null}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});