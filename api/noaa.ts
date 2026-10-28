import { KpData, KpForecast } from '../types';

const BASE_URL = 'https://services.swpc.noaa.gov';

export async function getLatestKp(): Promise<KpData> {
    const response = await fetch(`${BASE_URL}/json/planetary_k_index_1m.json`);
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.statusText);
    }
    const data: KpData[] = await response.json();
    return data[data.length - 1];
} 

export async function getKpForecast(): Promise<KpForecast[]> {
    const response = await fetch(`${BASE_URL}/products/noaa-planetary-k-index-forecast.json`);
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.statusText);
    }
    const data: KpForecast[] = await response.json();
    return data;
} 