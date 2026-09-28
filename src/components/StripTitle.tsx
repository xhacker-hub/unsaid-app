import React from 'react';
import { View, Text, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { PALETTE, RADIUS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';

interface StripTitleProps {
  lines: string[];
  style?: StyleProp<ViewStyle>;
  fontSize?: number;
}

export const StripTitle: React.FC<StripTitleProps> = ({
  lines,
  style,
  fontSize = 32,
}) => {
  return (
    <View style={[styles.container, style]}>
      {lines.map((line, idx) => {
        const tilt = idx % 2 === 0 ? '-2deg' : '1.5deg';
        return (
          <View
            key={idx}
            style={[
              styles.strip,
              {
                transform: [{ rotate: tilt }],
                marginBottom: idx < lines.length - 1 ? 6 : 0,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                getGroteskFont('700'),
                {
                  fontSize,
                  lineHeight: fontSize * 1.15,
                  letterSpacing: fontSize * TYPOGRAPHY.letterSpacing.h3,
                },
              ]}
            >
              {line}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginVertical: 14,
  },
  strip: {
    backgroundColor: PALETTE.ink,
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: RADIUS.paper,
    borderWidth: 1.5,
    borderColor: PALETTE.ink,
    shadowColor: PALETTE.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.35,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    color: PALETTE.marigold,
    textAlign: 'center',
    includeFontPadding: false,
  },
});
