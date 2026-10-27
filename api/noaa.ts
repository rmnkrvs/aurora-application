import { KpData } from '../types';

const BASE_URL = 'https://services.swpc.noaa.gov';

export async function getLatestKp(): Promise<KpData> {
    const response = await fetch(`${BASE_URL}/json/planetary_k_index_1m.json`);
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.statusText);
    }
    const data: KpData[] = await response.json();
    return data[data.length - 1];
}