export function getScoreMessage(score: number): string {

    if (score >= 85) {
        return 'Excellent conditions for aurora viewing!';
    } else if (score >= 60) {
        return 'Find a dark place and look up.';
    } else if (score >= 30) {
        return 'There is a chance for aurora viewing - keep an eye on the sky.';
    } else if (score >= 5){
        return 'Very low chance, so it might not be worth it. Enjoy a cozy evening indoors instead.';
    } else {
        return 'No aurora expected. Better luck next time!';
    }
}