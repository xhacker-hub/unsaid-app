import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { PALETTE, RADIUS, BORDERS, MOTION } from '../theme/tokens';
import { getHandFont } from '../theme/fonts';
import { useApp } from '../context/AppContext';

interface ThoughtCloudProps {
  phrases: string[];
  side: 'left' | 'right';
  staggerDelay?: number;
}

export const ThoughtCloud: React.FC<ThoughtCloudProps> = ({
  phrases,
  side,
  staggerDelay = 0,
}) => {
  const { reducedMotion } = useApp();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showDots, setShowDots] = useState(false);

  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const isCancelled = useRef(false);

  const phrase = phrases[currentIdx % phrases.length];

  useEffect(() => {
    isCancelled.current = false;

    if (reducedMotion) {
      // Reduced motion: show full sentence without typing or scaling (Section 7.6)
      setDisplayedText(phrase);
      setShowDots(true);
      scaleAnim.setValue(1);
      opacityAnim.setValue(1);
      return;
    }

    let cycleTimeout: any;

    const runCycle = async () => {
      // Initial stagger
      await new Promise((r) => setTimeout(r, staggerDelay));
      if (isCancelled.current) return;

      while (!isCancelled.current) {
        const textToType = phrases[currentIdx % phrases.length];
        setDisplayedText('');

        // 1. Three-dot trail appears (260ms)
        setShowDots(true);
        await new Promise((r) => setTimeout(r, MOTION.trailDots));
        if (isCancelled.current) return;

        // 2. Cloud scales up (420ms)
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: MOTION.cloudScaleUp,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 1,
            duration: MOTION.cloudScaleUp,
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise((r) => setTimeout(r, MOTION.cloudScaleUp));
        if (isCancelled.current) return;

        // 3. Text types character by character (~45ms/char, +80ms space, +220ms commas)
        for (let i = 1; i <= textToType.length; i++) {
          if (isCancelled.current) return;
          setDisplayedText(textToType.substring(0, i));
          const char = textToType.charAt(i - 1);
          const delay =
            char === ' '
              ? MOTION.spacePause
              : char === ','
              ? MOTION.commaPause
              : MOTION.charTyping;
          await new Promise((r) => setTimeout(r, delay));
        }

        // 4. Hard stop on em dash, held 1500ms, no cursor
        await new Promise((r) => setTimeout(r, MOTION.emDashHold));
        if (isCancelled.current) return;

        // 5. Cloud retracts (520ms)
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0,
            duration: MOTION.cloudRetract,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: MOTION.cloudRetract,
            useNativeDriver: true,
          }),
        ]).start();

        await new Promise((r) => setTimeout(r, MOTION.cloudRetract));
        setShowDots(false);
        setDisplayedText('');

        // 6. Pause before next cycle (2000ms)
        await new Promise((r) => setTimeout(r, MOTION.cyclePause));
        if (isCancelled.current) return;

        setCurrentIdx((prev) => (prev + 1) % phrases.length);
      }
    };

    runCycle();

    return () => {
      isCancelled.current = true;
      if (cycleTimeout) clearTimeout(cycleTimeout);
    };
  }, [phrases, currentIdx, staggerDelay, reducedMotion]);

  const isLeft = side === 'left';

  return (
    <View style={[styles.wrapper, isLeft ? styles.wrapperLeft : styles.wrapperRight]}>
      {/* Three-dot thought trail */}
      {showDots && (
        <View style={[styles.dotsContainer, isLeft ? styles.dotsLeft : styles.dotsRight]}>
          <View style={styles.dot1} />
          <View style={styles.dot2} />
          <View style={styles.dot3} />
        </View>
      )}

      {/* Cloud bubble */}
      <Animated.View
        style={[
          styles.cloud,
          isLeft ? styles.cloudLeft : styles.cloudRight,
          {
            transform: [
              { scale: scaleAnim },
              { rotate: isLeft ? '1deg' : '-2deg' },
            ],
            opacity: opacityAnim,
          },
        ]}
      >
        <Text
          style={[
            styles.cloudText,
            getHandFont('500'), // Handwritten Shantell Sans font
          ]}
        >
          {displayedText}
        </Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    top: -15,
    zIndex: 25,
    width: 175,
  },
  wrapperLeft: {
    left: 8,
  },
  wrapperRight: {
    right: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: -18,
    flexDirection: 'column',
    gap: 3,
  },
  dotsLeft: {
    right: 25,
  },
  dotsRight: {
    left: 25,
  },
  dot1: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: PALETTE.cloud,
    borderWidth: 1,
    borderColor: PALETTE.ink,
  },
  dot2: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: PALETTE.cloud,
    borderWidth: 1,
    borderColor: PALETTE.ink,
  },
  dot3: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: PALETTE.cloud,
    borderWidth: 1,
    borderColor: PALETTE.ink,
  },
  cloud: {
    backgroundColor: PALETTE.cloud,
    borderRadius: RADIUS.cloud,
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.ink,
    paddingVertical: 12,
    paddingHorizontal: 14,
    shadowColor: PALETTE.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 65,
    justifyContent: 'center',
  },
  cloudLeft: {
    borderBottomRightRadius: 4,
  },
  cloudRight: {
    borderBottomLeftRadius: 4,
  },
  cloudText: {
    color: PALETTE.ink,
    fontSize: 15,
    lineHeight: 20,
    textAlign: 'center',
  },
});
