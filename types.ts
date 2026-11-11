import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type TabParamList = {
    Forecasts: undefined;
    Sightings: undefined;
    Places: undefined;
    Insights: undefined;
}

export type RootStackParamList = {
    Welcome: undefined;
    Tabs: undefined;
    AddSighting: undefined;
};

export type KpData = {
    timeTag: string;
    kpIndex: number;
    estimatedKp: number;
};

export type KpForecast = {
    timeTag: string;
    kpForecast: number;
    observed: string;
};

export type Weather = {
    hourly: {
        time: string[];
        cloudCover: number[];
        visibility: number[];
    };
    daily: {
        time: string[];
        sunrise: string[];
        sunset: string[];
        moonPhase: number[];
    };
};

export type Coordinates = { 
    latitude: number; 
    longitude: number 
};

export type Sighting = {
    id: number;
    timestamp: string;
    latitude: number;
    longitude: number;
    note?: string;
    rating: number;
    photoUri?: string;
    kpIndex: number;
    cloudCover: number;
    moonPhase: number;
}

export type NewSighting = Omit<Sighting, 'id'>;

export type RootStackScreenProps<T extends keyof RootStackParamList> =
    NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> =
    BottomTabScreenProps<TabParamList, T>;