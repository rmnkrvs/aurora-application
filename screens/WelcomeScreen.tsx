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
        source={require('../assets/aurora-2000x1331.jpeg')}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }}
        contentFit='cover'
      />

      <View style={styles.content}>
        <Text variant='displayLarge' style={styles.centered}>aurora</Text>
        <Text variant='titleLarge' style={styles.centered}>
          Aurora forecasts for where you are, and a diary for the nights you saw them.
        </Text>
        <Text variant='bodyMedium' style={styles.centered}>Your location is used for local forecasts.</Text>
      </View>
      <Button
        mode='contained'
        onPress={handleStart}
        style={styles.button}
        contentStyle={styles.buttonContent}
        labelStyle={styles.buttonLabel}
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
  },
  content: {
    padding: 24,
    paddingBottom: 24,
    paddingTop: 250,
    gap: 12,
  },
  centered: {
    textAlign: 'center',
  },
  button: {
  borderRadius: 28,
},
buttonContent: {
  paddingVertical: 8,
},
buttonLabel: {
  fontSize: 18,
  lineHeight: 24,
  fontFamily: 'Outfit_600SemiBold',
},
});
