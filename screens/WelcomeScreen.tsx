import { Button, StyleSheet, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { RootStackScreenProps } from '../types';

export default function WelcomeScreen({navigation}: RootStackScreenProps<'Welcome'>) {
  return (
    <View style={styles.container}>
      
      <Image
        source={require('../assets/revontuli-etusivu.jpg')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}
        contentFit='cover'
      />
      
      <Button 
      onPress={() => navigation.replace('Tabs')} title="Go to Tabs" />
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
