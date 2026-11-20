import { KpForecast, Weather, ForecastSlot } from '../types';
import { calculateAuroraScore } from './score';
import { getCurrentHourIndex, isDark } from './time';

export function buildForecast(
    kpForecast: KpForecast[],
    weather: Weather,
    latitude: number
): ForecastSlot[] {

    const slots: ForecastSlot[] = [];

    for (const row of kpForecast) {
        const time = new Date(row.time_tag + 'Z');

        const hourIndex = getCurrentHourIndex(weather.hourly.time, time);

        const dayIndex = weather.daily.time.indexOf(time.toLocaleDateString('sv-SE'));

        if (dayIndex === -1) continue;

        const cloudCover = weather.hourly.cloud_cover[hourIndex];

        const score = calculateAuroraScore({
            kp: row.kp,
            cloudCover,
            moonPhase: weather.daily.moon_phase[dayIndex],
            isDark: isDark(weather.daily.sunrise[dayIndex], weather.daily.sunset[dayIndex]),
            latitude,
        });

        slots.push({ time, kp: row.kp, cloudCover, score });
    }

    return slots;
}