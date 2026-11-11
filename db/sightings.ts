import * as SQLite from 'expo-sqlite';
import { Sighting, NewSighting } from '../types';

export const db = SQLite.openDatabaseSync('sightingsdb');

export async function initializeDatabase() {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS sightings (
        id INTEGER PRIMARY KEY NOT NULL,
        timestamp TEXT NOT NULL,
        latitude REAL,
        longitude REAL,
        rating INTEGER,
        note TEXT,
        photoUri TEXT,
        kpIndex REAL,
        cloudCover REAL,
        moonPhase REAL
    );
    `);
}

export async function saveSighting(sighting: NewSighting) {
    await db.runAsync(
        'INSERT INTO sightings (timestamp, latitude, longitude, rating, note, photoUri, kpIndex, cloudCover, moonPhase) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [sighting.timestamp, sighting.latitude, sighting.longitude, sighting.rating, sighting.note ?? null, sighting.photoUri ?? null, sighting.kpIndex, sighting.cloudCover, sighting.moonPhase]
    )
}

export async function getSightings(): Promise<Sighting[]> {
    return db.getAllAsync<Sighting>('SELECT * FROM sightings ORDER BY timestamp DESC');
}

export async function deleteSighting(id: number) {
    await db.runAsync('DELETE FROM sightings WHERE id = ?', [id]);
}