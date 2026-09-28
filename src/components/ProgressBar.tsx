import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PALETTE, RADIUS, BORDERS } from '../theme/tokens';

interface ProgressBarProps {
  progress: number; // 0 to 1
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  height = 12,
}) => {
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: height / 2,
        },
      ]}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clampedProgress * 100) }}
    >
      <View
        style={[
          styles.fill,
          {
            width: `${Math.round(clampedProgress * 100)}%`,
            height: height - 4, // Inside 2px border
            borderRadius: (height - 4) / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    backgroundColor: PALETTE.cloud, // ink on cloud track
    borderWidth: BORDERS.ink2px, // 2px ink border
    borderColor: PALETTE.ink,
    overflow: 'hidden',
    width: '100%',
    padding: 1,
    justifyContent: 'center',
  },
  fill: {
    backgroundColor: PALETTE.ink,
  },
});
