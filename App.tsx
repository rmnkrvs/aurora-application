import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';

import WelcomeScreen from './screens/WelcomeScreen';
import Tabs from './Tabs';
import AddSightingScreen from './screens/AddSightingScreen';
import { RootStackParamList } from './types';

import { db, initializeDatabase } from './db/sightings';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';
import Storage from 'expo-sqlite/kv-store';

import { PaperProvider } from 'react-native-paper';
import { StatusBar } from 'expo-status-bar';

import { useFonts, Outfit_400Regular, Outfit_600SemiBold } from '@expo-google-fonts/outfit';
import { theme, navigationTheme } from './theme';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  const [fontsLoaded] = useFonts({ Outfit_400Regular, Outfit_600SemiBold });
  const [dbReady, setDbReady] = useState(false);

  useDrizzleStudio(db);

  useEffect(() => {
    initializeDatabase()
      .then(() => setDbReady(true))
      .catch(error => console.error('Error initializing database:', error));
  }, []);

  const [initialRoute] = useState<'Welcome' | 'Tabs'>(() =>
    Storage.getItemSync('hasSeenWelcome') ? 'Tabs' : 'Welcome'
  );

  if (!fontsLoaded) return null;

  return (
    <PaperProvider theme={theme}>
      <StatusBar style="light" />
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="AddSighting" component={AddSightingScreen} options={{ headerShown: true, title: 'New Sighting' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}