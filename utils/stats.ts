import { Sighting } from '../types';

type Stats = {
    total: number;
    seen: number;
    averageKp: number | null;
    averageScore: number | null;
    countsByRating: number[];
};

export function calculateStats(sightings: Sighting[]): Stats {

    const countsByRating = [0, 0, 0, 0]; // One counter per rating: [None, Weak, Clear, Strong]
    let seen = 0;
    let kpSum = 0;
    let scoreSum = 0;

    for (const sighting of sightings) {
        countsByRating[sighting.rating] += 1;

        if (sighting.rating > 0) {
            seen += 1;
            kpSum += sighting.kpIndex;
            scoreSum += sighting.score ?? 0;
        }
    }

    return {
        total: sightings.length,
        seen,
        averageKp: seen > 0 ? kpSum / seen : null,
        averageScore: seen > 0 ? scoreSum / seen : null,
        countsByRating,
    };
}