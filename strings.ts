import { SCORE_LIMITS } from './utils/score';

export function getScoreMessage(score: number): string {

    if (score >= SCORE_LIMITS.excellent) {
        return 'Excellent conditions for aurora viewing!';
    } else if (score >= SCORE_LIMITS.good) {
        return 'Find a dark place and look up.';
    } else if (score >= SCORE_LIMITS.fair) {
        return 'There is a chance for aurora viewing - keep an eye on the sky.';
    } else if (score >= SCORE_LIMITS.low){
        return 'Very low chance, so it might not be worth it. Enjoy a cozy evening indoors instead.';
    } else {
        return 'No aurora expected. Better luck next time!';
    }
}