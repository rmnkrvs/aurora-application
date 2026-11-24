import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

import { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getSightings } from '../db/sightings';
import { Sighting } from '../types';
import { RATINGS } from '../utils/ratings';

type MapMarker = {
  latitude: number;
  longitude: number;
  text: string
};

function buildMap(markers: MapMarker[]): string {

  const data = JSON.stringify(markers).replace(/</g, '\\u003c');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; }
  </style>
</head>

<body>
  <div id="map"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script>

    const markers = ${data};

    const map = L.map('map').setView([64, 26], 5);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    markers.forEach(m => {
    L.marker([m.latitude, m.longitude]).addTo(map).bindPopup(m.text);
    });

    const points = markers.map(m => [m.latitude, m.longitude]);
    if (points.length > 0) {
    map.fitBounds(points, { padding: [40, 40], maxZoom: 12 });
    }

  </script>
</body>
</html>`;
}

export default function PlacesScreen() {

  const [sightings, setSightings] = useState<Sighting[]>([]);

  useFocusEffect(
    useCallback(() => {
      getSightings()
        .then(setSightings)
        .catch(error => console.error('Error loading sightings:', error));
    }, [])
  );

  const html = useMemo(() => {
    const markers = sightings.map(s => ({
      latitude: s.latitude,
      longitude: s.longitude,
      text:
        new Date(s.timestamp).toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' }) +
        ' . ' + RATINGS[s.rating].label + (s.note ? ': ' + s.note : ''),
    }));
    return buildMap(markers);
  }, [sightings]);

  return (

    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        source={{ html }}
      />
    </SafeAreaView>
  );
}