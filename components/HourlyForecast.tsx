import { View, ScrollView, StyleSheet } from 'react-native';
import { Icon, Text, useTheme } from 'react-native-paper';
import { ForecastSlot } from '../types';
import { getScoreLevel } from '../utils/score';
import { formatTime } from '../utils/time';

type Props = {
    slots: ForecastSlot[];
};

export default function HourlyForecast({ slots }: Props) {

    const theme = useTheme();

    return (

        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.content}
        >
            {slots.map(slot => {
                const level = getScoreLevel(slot.score, theme);

                return (
                    <View
                        key={slot.time.toISOString()}
                        style={[
                            styles.card,
                            {
                                backgroundColor: theme.colors.surfaceVariant,
                                opacity: slot.isDark ? 1 : 0.5,
                            },
                        ]}
                    >
                        <Text variant='labelMedium'>
                            {formatTime(slot.time)}
                        </Text>

                        {slot.isDark ? (
                            <Text variant='titleLarge' style={{ color: level.color }}>
                                {slot.score}%
                            </Text>
                        ) : (
                            <Icon source='weather-sunny' size={24} color={theme.colors.onSurfaceVariant} />
                        )}

                        <Text variant='labelSmall' style={{ color: level.color }}>
                            {slot.isDark ? level.label : 'Daylight'}
                        </Text>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    content: {
        gap: 8,
    },
    card: {
        width: 72,
        paddingVertical: 12,
        borderRadius: 16,
        alignItems: 'center',
        gap: 4,
    },
});