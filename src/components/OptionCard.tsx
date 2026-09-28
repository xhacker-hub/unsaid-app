import React from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface OptionCardProps {
  label: string;
  selected: boolean;
  onPress: () => void;
  isMulti?: boolean;
}

export const OptionCard: React.FC<OptionCardProps> = ({
  label,
  selected,
  onPress,
  isMulti = false,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={[
        styles.card,
        selected ? styles.selectedCard : styles.unselectedCard,
      ]}
      accessibilityRole={isMulti ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
    >
      <View style={styles.contentRow}>
        <Text
          style={[
            styles.label,
            getGroteskFont('500'),
            selected ? styles.selectedLabel : styles.unselectedLabel,
          ]}
        >
          {label}
        </Text>

        <View
          style={[
            styles.indicator,
            isMulti ? styles.multiIndicator : styles.radioIndicator,
            selected && styles.selectedIndicator,
          ]}
        >
          {selected && (
            <Text style={styles.indicatorCheck}>
              {isMulti ? '✓' : '●'}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.card,
    borderWidth: BORDERS.ink2px,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginVertical: 6,
    minHeight: 52,
    justifyContent: 'center',
  },
  selectedCard: {
    backgroundColor: PALETTE.ink, // Selected = ink fill with cream text
    borderColor: PALETTE.ink,
  },
  unselectedCard: {
    backgroundColor: PALETTE.cloud, // Unselected = cream cloud with ink border
    borderColor: PALETTE.ink,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    lineHeight: 22,
    flex: 1,
    marginRight: 12,
  },
  selectedLabel: {
    color: PALETTE.cloud, // Cream text
  },
  unselectedLabel: {
    color: PALETTE.ink, // Ink text
  },
  indicator: {
    width: 22,
    height: 22,
    borderWidth: 2,
    borderColor: PALETTE.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioIndicator: {
    borderRadius: 11,
  },
  multiIndicator: {
    borderRadius: 6,
  },
  selectedIndicator: {
    borderColor: PALETTE.cloud,
    backgroundColor: PALETTE.cloud,
  },
  indicatorCheck: {
    color: PALETTE.ink,
    fontSize: 12,
    fontWeight: 'bold',
    lineHeight: 14,
  },
});
