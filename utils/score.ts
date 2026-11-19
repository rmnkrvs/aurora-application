import { ScoreInput } from '../types';

export function calculateAuroraScore(input: ScoreInput): number {


    const cloudFactor = 1 - (input.cloudCover / 100);

    // Moon phase: 0 = new moon, 0.5 = full moon, 1 = new moon again.
    // Convert it to brightness: 0 (dark) … 1 (fully lit).
    const illumination = 1 - Math.abs(input.moonPhase - 0.5) * 2;
    const moonFactor = 1 - 0.3 * illumination; // 30% dimming at full moon
    
    const darknessFactor = input.isDark ? 1 : 0;


    return (
        Math.round(100 * cloudFactor * moonFactor * darknessFactor)
    )
}