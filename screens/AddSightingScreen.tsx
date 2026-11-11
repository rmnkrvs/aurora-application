import { Button, Pressable, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { saveSighting } from '../db/sightings';
import { RootStackScreenProps } from '../types';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'react-native';

const RATINGS = [
    { value: 0, label: 'None' },
    { value: 1, label: 'Weak' },
    { value: 2, label: 'Clear' },
    { value: 3, label: 'Strong' },
];

export default function AddSightingScreen({ navigation }: RootStackScreenProps<'AddSighting'>) {

    const [rating, setRating] = useState(0);
    const [note, setNote] = useState('');
    const [photoUri, setPhotoUri] = useState<string | undefined>();

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.7,
        });

        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const takePhoto = async () => {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') return;

        const result = await ImagePicker.launchCameraAsync({ quality: 0.7 });
        if (!result.canceled) {
            setPhotoUri(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            await saveSighting({
                timestamp: new Date().toISOString(),
                latitude: 0,
                longitude: 0,
                rating: 0,
                note: note,
                photoUri: '',
                kpIndex: 0,
                cloudCover: 0,
                moonPhase: 0
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
            {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}

            <Button title="Choose from gallery" onPress={pickImage} />
            {photoUri && <Image source={{ uri: photoUri }} style={{ width: 200, height: 200 }} />}
            </View>

            <Button
                title='Save'
                onPress={handleSave}
            />

        </View>
    );
}