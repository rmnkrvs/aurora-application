import { ScoreInput, ScoreDetails } from '../types';

export function calculateScore(input: ScoreInput): ScoreDetails {

    const cloudFactor = 1 - (input.cloudCover / 100);

    // Moon phase: 0 = new moon, 0.5 = full moon, 1 = new moon again.
    // Convert it to brightness: 0 (dark) … 1 (fully lit).
    const illumination = 1 - Math.abs(input.moonPhase - 0.5) * 2;
    const moonFactor = 1 - 0.3 * illumination; // 30% dimming at full moon

    const darknessFactor = input.isDark ? 1 : 0;

    // Rough estimate: the further north, the lower the Kp needed.
    // ~Kp 5 at 60°N (Helsinki), ~Kp 2 at 66°N (Rovaniemi).
    const requiredKp = Math.max(1, 5 - (input.latitude - 60) * 0.5);

    const kpFactor = Math.min(1, input.kp / requiredKp);

    const score = Math.round(100 * kpFactor * cloudFactor * moonFactor * darknessFactor);

    return {
        score,
        requiredKp,
        factors: {
            kp: kpFactor,
            clouds: cloudFactor,
            darkness: darknessFactor,
            moon: moonFactor,
        },
    };
}