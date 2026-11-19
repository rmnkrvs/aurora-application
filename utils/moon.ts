const MOON_PHASES = [
    { name: 'New moon', icon: 'moon-new' },
    { name: 'Waxing crescent', icon: 'moon-waxing-crescent' },
    { name: 'First quarter', icon: 'moon-first-quarter' },
    { name: 'Waxing gibbous', icon: 'moon-waxing-gibbous' },
    { name: 'Full moon', icon: 'moon-full' },
    { name: 'Waning gibbous', icon: 'moon-waning-gibbous' },
    { name: 'Last quarter', icon: 'moon-last-quarter' },
    { name: 'Waning crescent', icon: 'moon-waning-crescent' },
];

export function getMoonPhase(moonPhase: number) {
    const index = Math.round(moonPhase * 8) % 8;
    return MOON_PHASES[index];
}