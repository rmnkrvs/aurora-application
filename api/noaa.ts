import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import { KpData } from '../types';

export default function noaa() {

    const [ kp, setKp ] = useState<KpData | null>(null);
    const [ loading, setLoading ] = useState(false);

    const getLatestKp = () => {
    setLoading(true);
    fetch(`https://services.swpc.noaa.gov/json/planetary_k_index_1m.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Error fetching data: ' + response.statusText);
        }
        return response.json();
      })
      .then(data => setKp_index(data[0].kp))
      .catch(error => console.error(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => { handleFetch(); }, []);
