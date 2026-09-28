import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { ChartResult, Topic } from '../types';
import { BandChip } from './BandChip';
import { useApp } from '../context/AppContext';

interface ChartBarProps {
  topic: Topic;
  result: ChartResult;
  onPress: () => void;
}

export const ChartBar: React.FC<ChartBarProps> = ({
  topic,
  result,
  onPress,
}) => {
  const { reducedMotion } = useApp();
  const animatedWidth = useRef(new Animated.Value(reducedMotion ? result.alignment : 0)).current;

  useEffect(() => {
    if (reducedMotion) {
      animatedWidth.setValue(result.alignment);
    } else {
      Animated.timing(animatedWidth, {
        toValue: result.alignment,
        duration: 600, // 600ms ease-out (Section 7.6)
        useNativeDriver: false,
      }).start();
    }
  }, [result.alignment, reducedMotion]);

  const widthInterpolation = animatedWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={styles.cardContainer}
      accessibilityRole="button"
      accessibilityLabel={`${topic.name}: ${result.band}. ${result.flags.join(', ')}`}
    >
      <View style={styles.topRow}>
        <View style={styles.topicInfo}>
          <Text style={[styles.topicTitle, getGroteskFont('600')]}>
            {topic.name}
          </Text>
          {result.updatedAfterTalk && (
            <Text style={[styles.updatedTag, getGroteskFont('500')]}>
              Updated after you talked
            </Text>
          )}
        </View>

        <BandChip band={result.band} hasDealbreaker={result.dealbreakerConflict} />
      </View>

      {/* Visual Chart Bar (ink fill on cloud track with 2px ink border) */}
      <View style={styles.barTrack}>
        <Animated.View
          style={[
            styles.barFill,
            {
              width: widthInterpolation,
            },
          ]}
        />
      </View>

      {/* Secondary flags (e.g. "Important to one of you") */}
      {result.flags.length > 0 && (
        <View style={styles.flagsRow}>
          {result.flags.map((flag, idx) => (
            <Text key={idx} style={[styles.flagText, getGroteskFont('500')]}>
              • {flag}
            </Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 16,
    marginVertical: 6,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  topicInfo: {
    flex: 1,
    marginRight: 10,
  },
  topicTitle: {
    color: PALETTE.paper,
    fontSize: 17,
  },
  updatedTag: {
    color: PALETTE.marigold,
    fontSize: 12,
    marginTop: 3,
  },
  barTrack: {
    height: 14,
    backgroundColor: PALETTE.cloud, // cloud track
    borderWidth: BORDERS.ink2px, // 2px ink border
    borderColor: PALETTE.ink,
    borderRadius: 7,
    overflow: 'hidden',
    justifyContent: 'center',
    padding: 1,
  },
  barFill: {
    height: 8,
    backgroundColor: PALETTE.ink, // ink fill
    borderRadius: 4,
  },
  flagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  flagText: {
    color: PALETTE.mist,
    fontSize: 12,
  },
});
