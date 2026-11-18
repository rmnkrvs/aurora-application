import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import WelcomeScreen from './screens/WelcomeScreen';
import Tabs from './Tabs';
import AddSightingScreen from './screens/AddSightingScreen';
import { RootStackParamList } from './types';

import { db, initializeDatabase } from './db/sightings';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

import { MD3DarkTheme, PaperProvider } from 'react-native-paper';
import { adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const Stack = createNativeStackNavigator<RootStackParamList>();

const theme = {
  ...MD3DarkTheme,
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

export default function App() {

  useDrizzleStudio(db);
  useEffect(() => {
    initializeDatabase().catch(error => console.error('Error initializing database:', error));
  }, []);

  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={DarkTheme}>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Tabs" component={Tabs} />
          <Stack.Screen name="AddSighting" component={AddSightingScreen} options={{ headerShown: true, title: 'New Sighting' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}