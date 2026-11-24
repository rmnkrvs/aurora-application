export function getCurrentHourIndex(times: string[], at: Date = new Date()): number {
    const nextHour = times.findIndex(time => new Date(time) > at);
    if (nextHour === -1) {
        return times.length - 1;
    }
    const hourIndex = Math.max(0, nextHour - 1);
    return hourIndex;
}

export function formatForecastTime(timeTag: string) {
    return new Date(timeTag + 'Z').toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatLocalTime(time: string): string {
    return new Date(time).toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' });
}

export function isDark(sunrise: string, sunset: string, now: Date = new Date()): boolean {
    return now < new Date(sunrise) || now > new Date(sunset);
}

export function getNextSun(
    daily: { sunrise: string[]; sunset: string[] },
    now: Date = new Date()
): { type: 'sunrise' | 'sunset'; time: string } {
    if (now < new Date(daily.sunrise[0])) {
        return { type: 'sunrise', time: daily.sunrise[0] };
    } else if (now < new Date(daily.sunset[0])) {
        return { type: 'sunset', time: daily.sunset[0] };
    } else {
        return { type: 'sunrise', time: daily.sunrise[1] };
    }
}
