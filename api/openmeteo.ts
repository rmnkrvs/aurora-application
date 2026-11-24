import { Weather } from "../types";

export async function getWeather(latitude: number, longitude: number): Promise<Weather> {

    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&hourly=cloud_cover&daily=sunrise,sunset,moon_phase&timezone=auto`);
    if (!response.ok) {
        throw new Error('Error fetching data: ' + response.statusText);
    }
    return response.json();
}