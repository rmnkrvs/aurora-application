export function formatForecastTime(timeTag: string) {
    return new Date(timeTag + 'Z').toLocaleTimeString('fi-FI', {
        hour: '2-digit',
        minute: '2-digit',
    });
}