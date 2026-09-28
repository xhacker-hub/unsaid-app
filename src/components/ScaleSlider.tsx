import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface ScaleSliderProps {
  value: number; // 1 to 5
  onChange: (val: number) => void;
  minLabel?: string;
  maxLabel?: string;
  options?: string[];
}

export const ScaleSlider: React.FC<ScaleSliderProps> = ({
  value,
  onChange,
  minLabel = 'Low',
  maxLabel = 'High',
  options,
}) => {
  const steps = [1, 2, 3, 4, 5];

  return (
    <View style={styles.container}>
      {/* 5 Step Touch Buttons */}
      <View style={styles.trackContainer}>
        <View style={styles.lineTrack} />
        {steps.map((step) => {
          const isSelected = value === step;
          return (
            <TouchableOpacity
              key={step}
              activeOpacity={0.85}
              onPress={() => onChange(step)}
              style={[
                styles.stepCircle,
                isSelected ? styles.stepCircleSelected : styles.stepCircleUnselected,
              ]}
              accessibilityRole="radio"
              accessibilityState={{ checked: isSelected }}
              accessibilityLabel={`Level ${step} of 5. ${options ? options[step - 1] : ''}`}
            >
              <Text
                style={[
                  styles.stepNumber,
                  getGroteskFont('700'),
                  isSelected ? styles.numberSelected : styles.numberUnselected,
                ]}
              >
                {step}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current selection label if custom options provided */}
      {options && options[value - 1] && (
        <View style={styles.currentLabelPill}>
          <Text style={[styles.currentLabelText, getGroteskFont('600')]}>
            {options[value - 1]}
          </Text>
        </View>
      )}

      {/* End labels */}
      <View style={styles.labelsRow}>
        <Text style={[styles.endLabel, getGroteskFont('500')]}>
          {minLabel}
        </Text>
        <Text style={[styles.endLabel, getGroteskFont('500')]}>
          {maxLabel}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: PALETTE.cloud,
    borderRadius: RADIUS.card,
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.ink,
    padding: 18,
    marginVertical: 8,
  },
  trackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    paddingVertical: 10,
  },
  lineTrack: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 4,
    backgroundColor: PALETTE.mist,
    zIndex: 1,
  },
  stepCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: BORDERS.ink2px,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stepCircleSelected: {
    backgroundColor: PALETTE.ink,
    borderColor: PALETTE.ink,
  },
  stepCircleUnselected: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.ink,
  },
  stepNumber: {
    fontSize: 16,
  },
  numberSelected: {
    color: PALETTE.cloud,
  },
  numberUnselected: {
    color: PALETTE.ink,
  },
  currentLabelPill: {
    alignSelf: 'center',
    backgroundColor: PALETTE.ground2,
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: RADIUS.pill,
    marginTop: 6,
    marginBottom: 6,
  },
  currentLabelText: {
    color: PALETTE.paper,
    fontSize: 13,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingHorizontal: 4,
  },
  endLabel: {
    fontSize: 12,
    color: PALETTE.amberText,
    maxWidth: '45%',
  },
});
