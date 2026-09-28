import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  Platform,
} from 'react-native';
import { PALETTE, MOTION } from '../theme/tokens';
import { StripTitle } from './StripTitle';
import { useApp } from '../context/AppContext';

interface BumblebeeRevealProps {
  onComplete: () => void;
}

export const BumblebeeReveal: React.FC<BumblebeeRevealProps> = ({ onComplete }) => {
  const { reducedMotion } = useApp();
  const { width, height } = Dimensions.get('window');
  const maxDim = Math.max(width, height) * 2.2;

  // 6 concentric alternating circles: ink, marigold, ink, marigold, ink, marigold
  const rings = [
    { color: PALETTE.ink, zIndex: 1 },
    { color: PALETTE.marigold, zIndex: 2 },
    { color: PALETTE.ink, zIndex: 3 },
    { color: PALETTE.marigold, zIndex: 4 },
    { color: PALETTE.ink, zIndex: 5 },
    { color: PALETTE.marigold, zIndex: 6 }, // Final flood circle
  ];

  // Scale animation values for the 6 rings
  const ringScales = useRef(rings.map(() => new Animated.Value(0))).current;
  const stripRise = useRef(new Animated.Value(40)).current;
  const stripOpacity = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (reducedMotion) {
      // Reduced motion fallback: 200ms cross-fade (Section 7.6)
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: MOTION.reducedFade,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(onComplete, 1200);
      });
      return;
    }

    // Concentric circles with ease-in (scale proportional to t²)
    const animations = rings.map((_, idx) => {
      const delay = idx * (MOTION.ringDuration * MOTION.ringStaggerPercent);
      return Animated.timing(ringScales[idx], {
        toValue: 1,
        duration: MOTION.ringDuration,
        delay,
        easing: Easing.bezier(0.5, 0, 0.75, 0), // ease-in t^2
        useNativeDriver: true,
      });
    });

    Animated.parallel(animations).start(() => {
      // Strip line "Your chart is ready." rises 40px and fades in
      Animated.parallel([
        Animated.timing(stripRise, {
          toValue: 0,
          duration: MOTION.stripRiseDuration,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(stripOpacity, {
          toValue: 1,
          duration: MOTION.stripRiseDuration,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Auto-advance after user sees the reveal
        setTimeout(onComplete, 1600);
      });
    });
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <Animated.View style={[styles.container, styles.floodBackground, { opacity: fadeAnim }]}>
        <StripTitle lines={['Your chart', 'is ready.']} fontSize={36} />
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      {/* 6 Expanding Concentric Rings from origin (center-top between figures) */}
      {rings.map((ring, idx) => {
        const scale = ringScales[idx].interpolate({
          inputRange: [0, 1],
          outputRange: [0, maxDim],
        });

        return (
          <Animated.View
            key={idx}
            style={[
              styles.ring,
              {
                width: 1,
                height: 1,
                borderRadius: 0.5,
                backgroundColor: ring.color,
                zIndex: ring.zIndex,
                transform: [{ scale }],
              },
            ]}
          />
        );
      })}

      {/* Strip title rising 40px and fading in over the final marigold background */}
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: stripOpacity,
            transform: [{ translateY: stripRise }],
            zIndex: 10,
          },
        ]}
      >
        <StripTitle lines={['Your chart', 'is ready.']} fontSize={36} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    zIndex: 100,
  },
  floodBackground: {
    backgroundColor: PALETTE.marigold,
  },
  ring: {
    position: 'absolute',
    alignSelf: 'center',
    top: '38%', // Center between the figures' heads
  },
  textContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
