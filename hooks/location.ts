import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { Coordinates } from '../types';

const DEFAULT_LOCATION = { latitude: 66.5, longitude: 25.7 };
const DEFAULT_CITY = 'Rovaniemi';
const UNKNOWN_CITY = 'Current location'; // shown when city name cant be found

export function useLocation() {

    const [location, setLocation] = useState<Coordinates | null>(null);
    const [city, setCity] = useState<string | null>(null);

    useEffect(() => {

        const fetchLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();
                if (status !== 'granted') {
                    Alert.alert('Location permission denied, showing default city instead.');
                    setLocation(DEFAULT_LOCATION);
                    setCity(DEFAULT_CITY);
                    return;
                }
                const position = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Low,
                });
                const { latitude, longitude } = position.coords;
                setLocation({ latitude, longitude });

                try {
                    const [place] = await Location.reverseGeocodeAsync({ latitude, longitude });
                    setCity(place?.city ?? UNKNOWN_CITY);
                } catch (error) {
                    console.error('Error getting city name:', error);
                    setCity(UNKNOWN_CITY);
                }

            } catch (error) {
                console.error('Error getting location:', error)
                setLocation(DEFAULT_LOCATION);
                setCity(DEFAULT_CITY);
            }
        };

        fetchLocation();
    }, []);

    return { location, city };
}