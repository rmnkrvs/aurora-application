export function getCurrentHourIndex(times: string[]): number {
    const now = new Date();
    const nextHour = times.findIndex(time => new Date(time) > now);

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

