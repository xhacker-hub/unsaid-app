import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { PALETTE, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { useApp } from '../context/AppContext';

interface WordmarkProps {
  size?: 'small' | 'medium' | 'large';
  onPress?: () => void;
  enableQuickHide?: boolean;
}

export const Wordmark: React.FC<WordmarkProps> = ({
  size = 'medium',
  onPress,
  enableQuickHide = true,
}) => {
  const { setQuickHideActive } = useApp();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (enableQuickHide) {
      // Tap wordmark to quickly trigger discreet hide screen!
      setQuickHideActive(true);
    }
  };

  const isLarge = size === 'large';
  const isSmall = size === 'small';

  const fontSize = isLarge ? 52 : isSmall ? 22 : 34;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={[styles.container, isLarge && styles.largeContainer]}
      accessibilityRole="header"
      accessibilityLabel="Unsaid wordmark. Tap to quick-hide app."
    >
      {/* Ragged torn rim background for large display sizes (Section 7.2) */}
      {isLarge && (
        <View style={styles.tornRim}>
          <Text
            style={[
              styles.textRim,
              getGroteskFont('700'),
              { fontSize, letterSpacing: fontSize * TYPOGRAPHY.letterSpacing.wordmark },
            ]}
          >
            Unsaid
          </Text>
        </View>
      )}

      <Text
        style={[
          styles.text,
          getGroteskFont('700'),
          { fontSize, letterSpacing: fontSize * TYPOGRAPHY.letterSpacing.wordmark },
        ]}
      >
        Unsaid
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    position: 'relative',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  largeContainer: {
    marginVertical: 12,
  },
  text: {
    color: PALETTE.paper,
    textAlign: 'center',
    includeFontPadding: false,
  },
  tornRim: {
    position: 'absolute',
    top: 3,
    left: 7,
    right: 9,
    bottom: 5,
    opacity: 0.85,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0px 0px 4px rgba(255, 255, 255, 0.95))',
      },
      default: {
        shadowColor: PALETTE.white,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.9,
        shadowRadius: 5,
      },
    }),
  },
  textRim: {
    color: PALETTE.cloud,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
