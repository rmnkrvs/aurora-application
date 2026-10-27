import { StyleSheet, Text, View } from 'react-native';
import { useEffect, useState } from 'react';
import { getLatestKp } from '../api/noaa';
import { KpData } from '../types';
import describeKp from '../utils/kp';

export default function ForecastsScreen() {

  const [kp, setKp] = useState<KpData | null>(null);

  useEffect(() => {
    getLatestKp()
      .then(setKp)
      .catch(error => console.error('Error fetching Kp data:', error));
  }, []);

  console.log('Latest Kp data:', kp);

  return (
    <View style={styles.container}>
      {kp ? (
        <Text>Kp: {kp.estimated_kp}</Text>
      ) : (
        <Text>Loading Kp data...</Text>
      )}

      <Text>{describeKp(kp?.estimated_kp || 0)}</Text>
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
