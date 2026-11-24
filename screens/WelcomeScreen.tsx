import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { Image } from 'expo-image';
import Storage from 'expo-sqlite/kv-store';
import { RootStackScreenProps } from '../types';

export default function WelcomeScreen({ navigation }: RootStackScreenProps<'Welcome'>) {

  const handleStart = async () => {
    try {
      Storage.setItemSync('hasSeenWelcome', 'true');
    } catch (error) {
      console.error('Could not save welcome flag:', error);
    }
    navigation.replace('Tabs');
  };

  return (
    <View style={styles.container}>

      <Image
        source={require('../assets/revontuli-etusivu.jpg')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}
        contentFit='cover'
      />

      <View style={styles.content}>
        <Text variant='displayMedium' style={styles.centered}>Aurora</Text>
        <Text variant='bodyLarge' style={styles.centered}>
          Aurora forecasts for where you are, and a diary for the nights you saw them.
        </Text>
        <Text variant='bodySmall' style={styles.centered}>Your location is used for local forecasts.</Text>
      </View>
      <Button
        mode='contained'
        onPress={handleStart}
        contentStyle={styles.button}
      >
        Get started!
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 24,
    paddingBottom: 48,
    paddingTop: 180,
    gap: 12,
  },
  centered: {
    textAlign: 'center',
  },
  button: {
  },
});
