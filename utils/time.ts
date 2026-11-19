export function formatForecastTime(timeTag: string) {
    return new Date(timeTag + 'Z').toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function isDark(sunrise: string, sunset: string, now: Date = new Date()): boolean {
    return now < new Date(sunrise) || now > new Date(sunset);
}