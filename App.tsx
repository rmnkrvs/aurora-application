import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';

import WelcomeScreen from './screens/WelcomeScreen';
import Tabs from './Tabs';
import { RootStackParamList } from './types';

import { db, initializeDatabase } from './db/sightings';
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {

  useDrizzleStudio(db);
  useEffect(() => {
    initializeDatabase().catch(error => console.error('Error initializing database:', error));
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Tabs" component={Tabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}