import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForecastsScreen from './screens/ForecastsScreen';
import SightingsScreen from './screens/SightingsScreen';
import PlacesScreen from './screens/PlacesScreen';
import InsightsScreen from './screens/InsightsScreen';
import { TabParamList } from './types';
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<TabParamList>();

export default function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen
                name="Forecasts"
                component={ForecastsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name='moon-outline' size={size} color={color} />
                }}
            />
            <Tab.Screen
                name="Sightings"
                component={SightingsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name='book-outline' size={size} color={color} />
                }} />
            <Tab.Screen
                name="Places"
                component={PlacesScreen}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name='map-outline' size={size} color={color} />
                }} />
            <Tab.Screen
                name="Insights"
                component={InsightsScreen}
                options={{
                    tabBarIcon: ({ size, color }) => <Ionicons name='stats-chart-outline' size={size} color={color} />
                }} />
        </Tab.Navigator>
    );
}