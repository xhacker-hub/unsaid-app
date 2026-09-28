import { Platform, TextStyle } from 'react-native';
import {
  useFonts as useFamiljenFonts,
  FamiljenGrotesk_400Regular,
  FamiljenGrotesk_500Medium,
  FamiljenGrotesk_600SemiBold,
  FamiljenGrotesk_700Bold,
} from '@expo-google-fonts/familjen-grotesk';
import {
  useFonts as useShantellFonts,
  ShantellSans_400Regular,
  ShantellSans_500Medium,
} from '@expo-google-fonts/shantell-sans';

/**
 * Loads custom typography for Unsaid.
 * UI/system text -> Familjen Grotesk
 * Unspoken thoughts/notes -> Shantell Sans
 */
export function useAppFonts() {
  const [groteskLoaded] = useFamiljenFonts({
    FamiljenGrotesk_400Regular,
    FamiljenGrotesk_500Medium,
    FamiljenGrotesk_600SemiBold,
    FamiljenGrotesk_700Bold,
  });

  const [shantellLoaded] = useShantellFonts({
    ShantellSans_400Regular,
    ShantellSans_500Medium,
  });

  return groteskLoaded && shantellLoaded;
}

/**
 * Font style helpers that gracefully fallback on web and native
 */
export const getGroteskFont = (weight: '400' | '500' | '600' | '700' = '400'): TextStyle => {
  if (Platform.OS === 'web') {
    return {
      fontFamily: `'Familjen Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`,
      fontWeight: weight,
    };
  }

  switch (weight) {
    case '700':
      return { fontFamily: 'FamiljenGrotesk_700Bold' };
    case '600':
      return { fontFamily: 'FamiljenGrotesk_600SemiBold' };
    case '500':
      return { fontFamily: 'FamiljenGrotesk_500Medium' };
    case '400':
    default:
      return { fontFamily: 'FamiljenGrotesk_400Regular' };
  }
};

export const getHandFont = (weight: '400' | '500' = '400'): TextStyle => {
  if (Platform.OS === 'web') {
    return {
      fontFamily: `'Shantell Sans', 'Caveat', 'Comic Sans MS', cursive`,
      fontWeight: weight,
    };
  }

  return weight === '500'
    ? { fontFamily: 'ShantellSans_500Medium' }
    : { fontFamily: 'ShantellSans_400Regular' };
};
