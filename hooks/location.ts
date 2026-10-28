import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { Coordinates } from '../types';

const DEFAULT_LOCATION = { latitude: 66.5, longitude: 25.7 };

export function useLocation() {

    const [location, setLocation] = useState<Coordinates | null>(null);

    useEffect(() => {

        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('No permission to get location');
                    setLocation(DEFAULT_LOCATION);
                    return;
                }
                const position = await Location.getCurrentPositionAsync({});
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });
            } catch (error) {
                console.error('Error getting location:', error)
                setLocation(DEFAULT_LOCATION);
            }
        };

        fetchLocation();
    }, []);

    return location;
}