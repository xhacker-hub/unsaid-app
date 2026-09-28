import React, { useState } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

export type PillVariant =
  | 'primaryOnMaroon' // Cream background, ink text
  | 'primaryOnLight' // Ink background, cream text (used on marigold or cream screens)
  | 'secondaryOutline' // Outline with 2px border
  | 'skipOutline'; // Subdued outline for "Skip for now"

interface PillButtonProps {
  title: string;
  onPress: () => void;
  variant?: PillVariant;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export const PillButton: React.FC<PillButtonProps> = ({
  title,
  onPress,
  variant = 'primaryOnMaroon',
  style,
  disabled = false,
  icon,
}) => {
  const [pressed, setPressed] = useState(false);

  const isPrimaryOnMaroon = variant === 'primaryOnMaroon';
  const isPrimaryOnLight = variant === 'primaryOnLight';
  const isSecondary = variant === 'secondaryOutline';
  const isSkip = variant === 'skipOutline';

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      onPress={onPress}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      style={[
        styles.buttonBase,
        isPrimaryOnMaroon && styles.primaryOnMaroon,
        isPrimaryOnLight && styles.primaryOnLight,
        isSecondary && styles.secondaryOutline,
        isSkip && styles.skipOutline,
        pressed && styles.pressedLift,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {icon}
      <Text
        style={[
          styles.textBase,
          getGroteskFont('600'),
          isPrimaryOnMaroon && styles.textPrimaryOnMaroon,
          isPrimaryOnLight && styles.textPrimaryOnLight,
          isSecondary && styles.textSecondary,
          isSkip && styles.textSkip,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: RADIUS.pill,
    paddingVertical: 14,
    paddingHorizontal: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48, // 44pt minimum touch target (Section 7.8)
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'transform 0.15s ease',
      },
    }),
  },
  primaryOnMaroon: {
    backgroundColor: PALETTE.paper,
    borderWidth: 0,
  },
  primaryOnLight: {
    backgroundColor: PALETTE.ink,
    borderWidth: 0,
  },
  secondaryOutline: {
    backgroundColor: 'transparent',
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.paper,
  },
  skipOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: PALETTE.mist,
  },
  pressedLift: {
    transform: [{ translateY: -2 }], // Press state: lift -2px (Section 7.3)
  },
  disabled: {
    opacity: 0.45,
  },
  textBase: {
    fontSize: TYPOGRAPHY.sizes.body,
    letterSpacing: 0.2,
    textAlign: 'center',
  },
  textPrimaryOnMaroon: {
    color: PALETTE.ink,
  },
  textPrimaryOnLight: {
    color: PALETTE.paper,
  },
  textSecondary: {
    color: PALETTE.paper,
  },
  textSkip: {
    color: PALETTE.mist,
  },
});
