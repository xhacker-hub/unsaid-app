import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { CompatibilityBand } from '../types';

interface BandChipProps {
  band: CompatibilityBand;
  hasDealbreaker?: boolean;
}

export const BandChip: React.FC<BandChipProps> = ({
  band,
  hasDealbreaker = false,
}) => {
  const getBandStyles = () => {
    switch (band) {
      case 'Strong match':
        return {
          container: styles.strongMatchContainer,
          text: styles.strongMatchText,
          label: 'Strong match',
        };
      case 'Some gaps':
        return {
          container: styles.someGapsContainer,
          text: styles.someGapsText,
          label: 'Some gaps',
        };
      case 'Talk in person':
        return {
          container: styles.talkInPersonContainer,
          text: styles.talkInPersonText,
          label: 'Talk in person',
        };
      case 'Talk about this':
        return {
          container: styles.talkAboutThisContainer,
          text: styles.talkAboutThisText,
          label: 'Talk about this',
        };
      case 'Not answered yet':
      default:
        return {
          container: styles.notAnsweredContainer,
          text: styles.notAnsweredText,
          label: 'Not answered yet',
        };
    }
  };

  const { container, text, label } = getBandStyles();

  return (
    <View style={[styles.chipBase, container]}>
      {hasDealbreaker && (
        <Text style={styles.dealbreakerDot}>🚩 </Text>
      )}
      <Text style={[styles.chipText, text, getGroteskFont('600')]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chipBase: {
    borderRadius: RADIUS.pill,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  chipText: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  strongMatchContainer: {
    backgroundColor: '#2D4E35', // Harmonious deep forest green for subtle reassurance
    borderColor: '#4E7D59',
  },
  strongMatchText: {
    color: '#D4EED8',
  },
  someGapsContainer: {
    backgroundColor: '#4D3412', // Warm amber / ochre
    borderColor: PALETTE.marigold,
  },
  someGapsText: {
    color: PALETTE.marigold,
  },
  talkAboutThisContainer: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.rose,
  },
  talkAboutThisText: {
    color: PALETTE.paper,
  },
  talkInPersonContainer: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.line,
  },
  talkInPersonText: {
    color: PALETTE.mist,
  },
  notAnsweredContainer: {
    backgroundColor: 'transparent',
    borderColor: PALETTE.line,
  },
  notAnsweredText: {
    color: PALETTE.mist,
  },
  dealbreakerDot: {
    fontSize: 11,
    marginRight: 2,
  },
});
