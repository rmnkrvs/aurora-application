import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type TabParamList = {
    Forecasts: undefined;
    Sightings: undefined;
    Places: undefined;
    Insights: undefined;
}

export type RootStackParamList = {
    Welcome: undefined;
    Tabs: undefined;
};

export type KpData = {
    time_tag: string;
    kp_index: number;
    estimated_kp: number;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
    BottomTabScreenProps<TabParamList, T>;