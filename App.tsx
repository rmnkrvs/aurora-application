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

import { MD3DarkTheme, PaperProvider, configureFonts } from 'react-native-paper';
import { adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';

import { useFonts, Outfit_400Regular, Outfit_600SemiBold } from '@expo-google-fonts/outfit';

const Stack = createNativeStackNavigator<RootStackParamList>();

const baseFonts = configureFonts({
  config: { fontFamily: 'Outfit_400Regular', fontWeight: 'normal' },
});

const fonts = {
  ...baseFonts,
  displayLarge: { ...baseFonts.displayLarge, fontFamily: 'Outfit_600SemiBold' },
  displayMedium: { ...baseFonts.displayMedium, fontFamily: 'Outfit_600SemiBold' },
  titleLarge: { ...baseFonts.titleLarge, fontFamily: 'Outfit_600SemiBold' },
  titleMedium: { ...baseFonts.titleMedium, fontFamily: 'Outfit_600SemiBold' },
};

const theme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#5EEAB0',
    onPrimary: '#06241A',
    secondary: '#A78BFA',
    background: '#0B1220',
    surface: '#152036',
  },
};

const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  materialDark: theme,
});

const navigationTheme = {
  ...DarkTheme,
  fonts: {
    regular: { fontFamily: 'Outfit_400Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Outfit_400Regular', fontWeight: '500' as const },
    bold: { fontFamily: 'Outfit_600SemiBold', fontWeight: '600' as const },
    heavy: { fontFamily: 'Outfit_600SemiBold', fontWeight: '700' as const },
  },
};

export default function App() {

  const [fontsLoaded] = useFonts({ Outfit_400Regular, Outfit_600SemiBold });

  useDrizzleStudio(db);

  useEffect(() => {
    initializeDatabase().catch(error => console.error('Error initializing database:', error));
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