import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text, useTheme, Divider } from 'react-native-paper';
import { ForecastSlot } from '../types';
import { getScoreLevel } from '../utils/score';
import { formatTime, toDateKey } from '../utils/time';

type Props = {
    days: ForecastSlot[];
};

export default function DailyForecast({ days }: Props) {
    const theme = useTheme();
    const todayKey = toDateKey(new Date());

    return (
        <View>
            {days.map((slot, index) => {
                const level = getScoreLevel(slot.score, theme);
                const isToday = toDateKey(slot.time) === todayKey;

                return (
                    <View key={slot.time.toISOString()}>
                        <View style={styles.row}>
                            <View style={styles.labels}>
                                <Text variant='titleSmall'>
                                    {isToday ? 'Today' : slot.time.toLocaleDateString('en-GB', { weekday: 'long' })}
                                </Text>
                                <Text variant='labelSmall'>
                                    {slot.score > 0 ? `Best at ${formatTime(slot.time)}` : 'No chance'}
                                </Text>
                            </View>

                            <View style={styles.barWrapper}>
                                <ProgressBar progress={slot.score / 100} color={level.color} style={styles.bar} />
                            </View>

                            <Text variant='titleMedium' style={[styles.score, { color: level.color }]}>
                                {slot.score}%
                            </Text>

                        </View>
                        {index < days.length - 1 && <Divider style={styles.divider} />}

                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    divider: {
        marginVertical: 12,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    labels: {
        width: 100,
    },
    bar: {
        height: 8,
        borderRadius: 4,
    },
    barWrapper: {
        flex: 1,
    },
    score: {
        width: 48,
        textAlign: 'right',
    },
});