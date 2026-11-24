import { MD3DarkTheme, configureFonts, adaptNavigationTheme } from 'react-native-paper';
import { DarkTheme as NavigationDarkTheme } from '@react-navigation/native';

const baseFonts = configureFonts({
  config: { fontFamily: 'Outfit_400Regular', fontWeight: 'normal' },
});

export const fonts = {
  ...baseFonts,
  displayLarge: { ...baseFonts.displayLarge, fontFamily: 'Outfit_600SemiBold' },
  displayMedium: { ...baseFonts.displayMedium, fontFamily: 'Outfit_600SemiBold' },
  titleLarge: { ...baseFonts.titleLarge, fontFamily: 'Outfit_600SemiBold' },
  titleMedium: { ...baseFonts.titleMedium, fontFamily: 'Outfit_600SemiBold' },
};

export const theme = {
  ...MD3DarkTheme,
  fonts,
  colors: {
    ...MD3DarkTheme.colors,

    primary: '#5CF29A',
    onPrimary: '#032713',
    primaryContainer: '#0F4F4A',
    onPrimaryContainer: '#B8F7E6',

    secondary: '#A78BFA',
    onSecondary: '#1E1147',
    secondaryContainer: '#17445A',
    onSecondaryContainer: '#DCD6FF',

    tertiary: '#F2C469',
    onTertiary: '#3A2A00',

    background: '#081425',
    surface: '#0E1F36',
    surfaceVariant: '#1A3350',
    onSurfaceVariant: '#A8BCD4',
    outline: '#4A6585',
    outlineVariant: '#26405C',

    elevation: {
      level0: 'transparent',
      level1: '#112640',
      level2: '#152C48',
      level3: '#193350',
      level4: '#1C3756',
      level5: '#203D5E',
    },
  },
};

export const { DarkTheme } = adaptNavigationTheme({
  reactNavigationDark: NavigationDarkTheme,
  materialDark: theme,
});

export const navigationTheme = {
  ...DarkTheme,
  fonts: {
    regular: { fontFamily: 'Outfit_400Regular', fontWeight: '400' as const },
    medium: { fontFamily: 'Outfit_400Regular', fontWeight: '500' as const },
    bold: { fontFamily: 'Outfit_600SemiBold', fontWeight: '600' as const },
    heavy: { fontFamily: 'Outfit_600SemiBold', fontWeight: '700' as const },
  },
};