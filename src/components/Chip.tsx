import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { PALETTE, RADIUS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  style,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || !onPress}
      style={[
        styles.chip,
        selected && styles.selectedChip,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
    >
      <Text
        style={[
          styles.text,
          getGroteskFont('500'),
          selected && styles.selectedText,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: PALETTE.line, // 1.5px line border on maroon
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.paper,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontSize: 13,
    color: PALETTE.paper, // cream text on maroon
  },
  selectedText: {
    color: PALETTE.paper,
    fontWeight: '600',
  },
});
