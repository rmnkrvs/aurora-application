import { View, StyleSheet } from 'react-native';
import { Button, Dialog, Portal, ProgressBar, Text, useTheme } from 'react-native-paper';
import { ScoreDetails } from '../types';

type Props = {
    visible: boolean;
    onDismiss: () => void;
    details: ScoreDetails;
    kp: number;
    cloudCover: number;
    isDark: boolean;
    moonName: string;
};

function FactorRow({ label, value, progress, isBlocker }: {
    label: string;
    value: string;
    progress: number;
    isBlocker?: boolean;
}) {
    const theme = useTheme();
    const color = isBlocker ? theme.colors.error : theme.colors.primary;

    return (
        <View style={styles.row}>
            <View style={styles.header}>
                <Text variant='labelLarge'>{label}</Text>
                <Text variant='labelMedium'>{value}</Text>
            </View>

            <ProgressBar progress={progress} color={color} style={styles.bar} />

            {isBlocker && (
                <Text variant='labelSmall' style={{ color }}>Biggest blocker</Text>
            )}
        </View>
    );
}

export default function ScoreInfoDialog({ visible, onDismiss, details, kp, cloudCover, isDark, moonName }: Props) {

    const blocker = Object.entries(details.factors).sort((a, b) => a[1] - b[1])[0];
    const blockerName = blocker[1] < 1 ? blocker[0] : null;

    return (
        <Portal>
            <Dialog visible={visible} onDismiss={onDismiss}>
                <Dialog.Title>How is this score calculated?</Dialog.Title>
                <Dialog.Content style={{ gap: 16 }}>
                    <Text variant='bodyMedium'>
                        The chance combines four things. Each is scored 0–100 % and they are
                        multiplied, so one weak factor can pull the whole result down.
                    </Text>

                    <FactorRow
                        label='Kp index'
                        value={`${kp.toFixed(1)} / ~${details.requiredKp.toFixed(0)} needed`}
                        progress={details.factors.kp}
                        isBlocker={blockerName === 'kp'}
                    />
                    <FactorRow
                        label='Cloud cover'
                        value={`${cloudCover} %`}
                        progress={details.factors.clouds}
                        isBlocker={blockerName === 'clouds'}
                    />
                    <FactorRow
                        label='Darkness'
                        value={isDark ? 'Dark' : 'Daylight'}
                        progress={details.factors.darkness}
                        isBlocker={blockerName === 'darkness'}
                    />
                    <FactorRow
                        label='Moon'
                        value={moonName}
                        progress={details.factors.moon}
                        isBlocker={blockerName === 'moon'}
                    />

                    <Text variant='bodyMedium'>This is an estimate based on simplified rules, not an official forecast.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={onDismiss}>Done</Button>
                </Dialog.Actions>
            </Dialog>
        </Portal>
    );
}

const styles = StyleSheet.create({
    row: {
        gap: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between', // label on the left, value on the right
    },
    bar: {
        height: 8,
        borderRadius: 4,
    },
});