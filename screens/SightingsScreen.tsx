import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackScreenProps } from '../types';

export default function SightingsScreen({navigation}: RootStackScreenProps<'AddSighting'>) {
  return (
    <View style={styles.container}>
      <Button 
      onPress={() => navigation.navigate('AddSighting')} title="Add Sighting" />
      
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
