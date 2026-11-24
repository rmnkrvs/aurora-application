import { StyleSheet, Text, View } from 'react-native';
import { getSightings } from '../db/sightings';
import { calculateStats } from '../utils/stats';

export default function InsightsScreen() {

getSightings().then(s => console.log(calculateStats(s)));

  return (
    <View style={styles.container}>
      <Text>Manage your privacy settings here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    fontSize: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
