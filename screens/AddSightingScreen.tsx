import { Button, Pressable, Text, TextInput, View } from 'react-native';
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
    const location = useLocation();
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
        <View>

            <Text>Add sighting</Text>

            <View>
                {RATINGS.map(r => (
                    <Pressable
                        key={r.value}
                        onPress={() => setRating(r.value)}
                        style={{ backgroundColor: rating === r.value ? 'blue' : 'gray', padding: 10, margin: 5 }}
                    >
                        <Text style={{ color: 'white' }}>{r.label}</Text>
                    </Pressable>
                ))}
            </View>

            <TextInput
                placeholder='Write a note'
                onChangeText={text => setNote(text)}
                value={note}
                multiline
            />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Button title="Take a photo" onPress={takePhoto} />
                <Button title="Choose from gallery" onPress={pickImage} />
            </View>
            {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}

            <Button
                title='Save'
                onPress={handleSave}
                disabled={!location || !kp || !weather}
            />

        </View>
    );
}