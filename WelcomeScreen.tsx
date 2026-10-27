import { Button, StyleSheet, Text, View } from 'react-native';
import { RootStackScreenProps } from './types';

export default function WelcomeScreen({navigation}: RootStackScreenProps<'Welcome'>) {
  return (
    <View style={styles.container}>
      <Button 
      onPress={() => navigation.replace('Tabs')} title="Go to Tabs" />
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
