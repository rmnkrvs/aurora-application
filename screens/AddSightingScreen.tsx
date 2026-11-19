import { ScrollView, View } from 'react-native';
import { Button, Card, TextInput, Text, SegmentedButtons } from 'react-native-paper';
import { useState, useEffect } from 'react';
import { saveSighting } from '../db/sightings';
import { RootStackScreenProps, Weather, KpData } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';
import { File, Paths } from 'expo-file-system';
import { RATINGS } from '../utils/ratings';
import { useLocation } from '../hooks/location';
import { getLatestKp } from '../api/noaa';
import { getWeather } from '../api/openmeteo';

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

        const now = new Date();
        const nextHour = weather.hourly.time.findIndex(time => new Date(time) > now);
        const hourIndex = Math.max(0, nextHour - 1);

        try {
            await saveSighting({
                timestamp: now.toISOString(),
                latitude: location.latitude,
                longitude: location.longitude,
                rating,
                note,
                photoUri,
                kpIndex: kp.kp_index,
                cloudCover: weather.hourly.cloud_cover[hourIndex],
                moonPhase: weather.daily.moon_phase[0],
            });
            navigation.goBack();
        } catch (error) {
            console.error('Error saving sighting:', error);
        }
    };

    return (
        <ScrollView contentContainerStyle={{ padding: 16 }}>

            <Card>

                <Card.Title title='Add sighting' />

                <Card.Content style={{ gap: 16 }}>
                    <Text variant='headlineMedium'>Add sighting</Text>

                    <SegmentedButtons
                        value={String(rating)}
                        onValueChange={value => setRating(Number(value))}
                        buttons={[
                            {
                                value: '0',
                                label: 'None',
                            },
                            {
                                value: '1',
                                label: 'Weak',
                            },
                            {
                                value: '2',
                                label: 'Clear'
                            },
                            {
                                value: '3',
                                label: 'Strong',
                            }
                        ]}
                    />

                    <TextInput
                        mode='outlined'
                        style={{ marginBottom: 10 }}
                        label='Note'
                        onChangeText={text => setNote(text)}
                        value={note}
                        multiline
                    />

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                    {photoUri && <Image source={{ uri: photoUri }} style={{ width: '100%', height: 200 }} />}

                    <Button
                        mode='contained'
                        onPress={handleSave}
                        disabled={!location || !kp || !weather}
                    >
                        Save
                    </Button>

                </Card.Content>
            </Card>
        </ScrollView>
    );
}