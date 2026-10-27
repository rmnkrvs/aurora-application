import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ForecastsScreen from './ForecastsScreen';
import SightingsScreen from './SightingsScreen';
import PlacesScreen from './PlacesScreen';
import InsightsScreen from './InsightsScreen';
import { TabParamList } from './types';

const Tab = createBottomTabNavigator<TabParamList>();

export default function Tabs() {
    return (
        <Tab.Navigator>
            <Tab.Screen name="Forecasts" component={ForecastsScreen} />
            <Tab.Screen name="Sightings" component={SightingsScreen} />
            <Tab.Screen name="Places" component={PlacesScreen} />
            <Tab.Screen name="Insights" component={InsightsScreen} />
        </Tab.Navigator>
    );
}