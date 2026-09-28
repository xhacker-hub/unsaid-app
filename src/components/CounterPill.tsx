import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface CounterPillProps {
  count: number;
  label?: string;
}

export const CounterPill: React.FC<CounterPillProps> = ({ count, label }) => {
  // Format number en-IN (e.g. 1,24,800)
  const formattedCount = new Intl.NumberFormat('en-IN').format(count);

  return (
    <View style={styles.pill}>
      <Text style={[styles.number, getGroteskFont('700')]}>
        {formattedCount}
      </Text>
      {label && (
        <Text style={[styles.label, getGroteskFont('500')]}>
          {' '}{label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  pill: {
    backgroundColor: PALETTE.marigold,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: PALETTE.ink,
    paddingVertical: 5,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    shadowColor: PALETTE.ink,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  number: {
    color: PALETTE.ink,
    fontSize: 13,
    letterSpacing: 0.5,
  },
  label: {
    color: PALETTE.amberText,
    fontSize: 12,
  },
});
