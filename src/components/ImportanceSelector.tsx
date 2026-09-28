import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface ImportanceSelectorProps {
  importance: 1 | 2 | 3;
  onChange: (val: 1 | 2 | 3) => void;
}

export const ImportanceSelector: React.FC<ImportanceSelectorProps> = ({
  importance,
  onChange,
}) => {
  const options: Array<{ level: 1 | 2 | 3; label: string }> = [
    { level: 1, label: 'Low' },
    { level: 2, label: 'Medium' },
    { level: 3, label: 'High' },
  ];

  return (
    <View style={styles.container}>
      <Text style={[styles.label, getGroteskFont('600')]}>
        HOW MUCH DOES THIS MATTER TO YOU?
      </Text>

      <View style={styles.buttonRow}>
        {options.map((opt) => {
          const isSelected = importance === opt.level;
          return (
            <TouchableOpacity
              key={opt.level}
              activeOpacity={0.8}
              onPress={() => onChange(opt.level)}
              style={[
                styles.optionButton,
                isSelected ? styles.buttonSelected : styles.buttonUnselected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Importance ${opt.label}`}
            >
              <Text
                style={[
                  styles.optionText,
                  getGroteskFont('600'),
                  isSelected ? styles.textSelected : styles.textUnselected,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 12,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    color: PALETTE.mist,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonSelected: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  buttonUnselected: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.line,
  },
  optionText: {
    fontSize: 14,
  },
  textSelected: {
    color: PALETTE.ink,
  },
  textUnselected: {
    color: PALETTE.paper,
  },
});
