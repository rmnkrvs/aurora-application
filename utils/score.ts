import { MD3Theme } from 'react-native-paper';
import { ScoreInput, ScoreDetails, ScoreLevel } from '../types';

export const SCORE_LIMITS = { excellent: 85, good: 60, fair: 30, low: 5 };

export function calculateScore(input: ScoreInput): ScoreDetails {

    const cloudFactor = 1 - (input.cloudCover / 100);

    // Moon phase: 0 = new moon, 0.5 = full moon, 1 = new moon. Convert it to brightness: 0 (dark) ... 1 (full light)
    const illumination = 1 - Math.abs(input.moonPhase - 0.5) * 2;
    const moonFactor = 1 - 0.3 * illumination; // 30% dimming at full moon

    const darknessFactor = input.isDark ? 1 : 0;

    // Rough estimate: the further north, the lower the Kp needed. ~Kp 5 at Helsinki, ~Kp 2 at Rovaniemi
    const requiredKp = Math.max(1, 5 - (input.latitude - 60) * 0.5);

    const kpFactor = Math.min(1, input.kp / requiredKp); // more Kp than needed does not help

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

export function getScoreLevel(score: number, theme: MD3Theme): ScoreLevel {

    if (score >= SCORE_LIMITS.excellent) {
        return { label: 'Excellent', color: theme.colors.primary };
    }
    if (score >= SCORE_LIMITS.good) {
        return { label: 'Good', color: theme.colors.primary };
    }
    if (score >= SCORE_LIMITS.fair) {
        return { label: 'Fair', color: theme.colors.tertiary };
    }
    return { label: 'Low', color: theme.colors.onSurfaceVariant };
}