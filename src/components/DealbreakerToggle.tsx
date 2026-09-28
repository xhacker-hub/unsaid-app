import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface DealbreakerToggleProps {
  enabled: boolean;
  onToggle: () => void;
}

export const DealbreakerToggle: React.FC<DealbreakerToggleProps> = ({
  enabled,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={[
        styles.container,
        enabled ? styles.containerActive : styles.containerInactive,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: enabled }}
      accessibilityLabel={`Dealbreaker for me. ${enabled ? 'Enabled' : 'Disabled'}`}
    >
      <View style={styles.leftContent}>
        <View style={styles.flagIcon}>
          <Text style={[styles.flagSymbol, enabled && styles.flagSymbolActive]}>
            🚩
          </Text>
        </View>
        <View style={styles.textColumn}>
          <Text
            style={[
              styles.title,
              getGroteskFont('600'),
              enabled ? styles.titleActive : styles.titleInactive,
            ]}
          >
            This is a dealbreaker for me
          </Text>
          <Text
            style={[
              styles.subtitle,
              getGroteskFont('400'),
              enabled ? styles.subtitleActive : styles.subtitleInactive,
            ]}
          >
            If we differ here, the chart highlights it for discussion.
          </Text>
        </View>
      </View>

      <View style={[styles.switchTrack, enabled && styles.switchTrackActive]}>
        <View style={[styles.switchThumb, enabled && styles.switchThumbActive]} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    marginVertical: 8,
  },
  containerActive: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.wine,
  },
  containerInactive: {
    backgroundColor: 'transparent',
    borderColor: PALETTE.line,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  flagIcon: {
    marginRight: 10,
  },
  flagSymbol: {
    fontSize: 18,
    opacity: 0.6,
  },
  flagSymbolActive: {
    opacity: 1,
  },
  textColumn: {
    flex: 1,
  },
  title: {
    fontSize: 14,
  },
  titleActive: {
    color: PALETTE.paper,
  },
  titleInactive: {
    color: PALETTE.mist,
  },
  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  subtitleActive: {
    color: PALETTE.mist,
  },
  subtitleInactive: {
    color: PALETTE.mist,
    opacity: 0.7,
  },
  switchTrack: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: PALETTE.line,
    padding: 2,
    justifyContent: 'center',
  },
  switchTrackActive: {
    backgroundColor: PALETTE.wine,
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: PALETTE.mist,
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
    backgroundColor: PALETTE.cloud,
  },
});
