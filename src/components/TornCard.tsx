import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp, Platform } from 'react-native';
import { PALETTE, RADIUS, BORDERS } from '../theme/tokens';

export interface TornCardProps {
  children: React.ReactNode;
  variant?: 'cream' | 'ink';
  tilt?: 'left' | 'right' | 'slight' | 'none';
  style?: StyleProp<ViewStyle>;
  minHeight?: number;
}

export const TornCard: React.FC<TornCardProps> = ({
  children,
  variant = 'cream',
  tilt = 'none',
  style,
  minHeight,
}) => {
  const isCream = variant === 'cream';

  const rotation =
    tilt === 'left' ? '-3deg' : tilt === 'right' ? '3deg' : tilt === 'slight' ? '-1.5deg' : '0deg';

  return (
    <View
      style={[
        styles.cardBase,
        isCream ? styles.creamCard : styles.inkCard,
        {
          transform: [{ rotate: rotation }],
          minHeight,
        },
        style,
      ]}
    >
      {/* Ragged paper border effect */}
      <View style={[styles.innerContent, isCream ? styles.innerCream : styles.innerInk]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardBase: {
    borderRadius: RADIUS.paper,
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.ink,
    marginVertical: 7, // 14px uniform gap when stacked
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 12px rgba(36, 6, 13, 0.25)',
      },
      default: {
        shadowColor: PALETTE.ink,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.22,
        shadowRadius: 5,
        elevation: 4,
      },
    }),
  },
  creamCard: {
    backgroundColor: PALETTE.cloud,
  },
  inkCard: {
    backgroundColor: PALETTE.ink,
    borderColor: PALETTE.line,
  },
  innerContent: {
    padding: 16,
    borderRadius: RADIUS.paper - 1,
  },
  innerCream: {
    backgroundColor: PALETTE.cloud,
  },
  innerInk: {
    backgroundColor: PALETTE.ink,
  },
});
