import { ScrollView, View, Image, StyleSheet } from 'react-native';
import { Button, Card, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { saveSighting } from '../db/sightings';
import { RootStackScreenProps, Weather, KpData } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { File, Paths } from 'expo-file-system';
import { RATINGS } from '../utils/ratings';
import { useLocation } from '../hooks/location';
import { getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo';
import { getCurrentHourIndex } from '../utils/time';
import { calculateScore } from '../utils/score';
import { isDark } from '../utils/time';

export default function AddSightingScreen({ navigation }: RootStackScreenProps<'AddSighting'>) {

    const [rating, setRating] = useState(0);
    const [note, setNote] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>();
    const { location } = useLocation();
    const [kp, setKp] = useState<KpData | null>(null);
    const [weather, setWeather] = useState<Weather | null>(null);

    useEffect(() => {
        getLatestKp()
            .then(setKp)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (!location) return;
        getWeather(location.latitude, location.longitude)
            .then(setWeather)
            .catch(console.error);
    }, [location]);

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        if (!result.canceled) {
            try {
                const permanentUri = await copyToDocuments(result.assets[0].uri);
                setPhotoUri(permanentUri);
            } catch (error) {
                console.error('Could not copy photo:', error);
            }
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!result.canceled) {
            try {
                const permanentUri = await copyToDocuments(result.assets[0].uri);
                setPhotoUri(permanentUri);
            } catch (error) {
                console.error('Could not copy photo:', error);
            }
        }
    };

    const copyToDocuments = async (uri: string) => {
        const source = new File(uri);
        const target = new File(Paths.document, `sighting-${Date.now()}.jpg`);
        await source.copy(target);
        return target.uri;
    };

    const handleSave = async () => {

        if (!location || !kp || !weather) return;

        const hourIndex = getCurrentHourIndex(weather.hourly.time);

        const score = calculateScore({
            kp: kp.estimated_kp,
            cloudCover: weather.hourly.cloud_cover[hourIndex],
            moonPhase: weather.daily.moon_phase[0],
            isDark: isDark(weather.daily.sunrise[0], weather.daily.sunset[0]),
            latitude: location.latitude,
        }).score;

        try {
            await saveSighting({
                timestamp: new Date().toISOString(),
                latitude: location.latitude,
                longitude: location.longitude,
                rating,
                note: note.trim() || undefined,
                photoUri,
                kpIndex: kp.estimated_kp,
                cloudCover: weather.hourly.cloud_cover[hourIndex],
                moonPhase: weather.daily.moon_phase[0],
                score,
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error saving sighting:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <Card>

                <Card.Content style={styles.cardContent}>
                    <Text variant='headlineMedium'>Add sighting</Text>

                    <SegmentedButtons
                        value={String(rating)}
                        onValueChange={value => setRating(Number(value))}
                        buttons={RATINGS.map(r => ({ value: String(r.value), label: r.label }))}
                    />

                    <TextInput
                        mode='outlined'
                        label='Note'
                        onChangeText={text => setNote(text)}
                        value={note}
                        multiline
                    />

                    <View style={styles.buttons}>
                        <Button
                            mode='outlined'
                            onPress={takePhoto}
                        >
                            Take a photo
                        </Button>
                        <Button
                            mode='outlined'
                            onPress={pickImage}
                        >
                            Choose from gallery
                        </Button>
                    </View>
                    {photoUri && <Image source={{ uri: photoUri }} style={styles.image} />}

                    <Button
                        mode='contained'
                        onPress={handleSave}
                        disabled={!location || !kp || !weather}
                    >
                        Save
                    </Button>

                    {(!location || !kp || !weather) && (
                        <Text variant='bodySmall'>Loading conditions...</Text>
                    )}

                </Card.Content>
            </Card>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 16
    },
    cardContent: {
        gap: 16
    },
    buttons: {
        flexDirection: 'row', 
        justifyContent: 'space-between'
    },
    image: {
        width: '100%',
        height: 200,
    },
});