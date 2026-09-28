import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { PALETTE, RADIUS, BORDERS } from '../theme/tokens';

interface ShimmerLoadingProps {
  height?: number;
  width?: string | number;
  borderRadius?: number;
}

export const ShimmerLoading: React.FC<ShimmerLoadingProps> = ({
  height = 48,
  width = '100%',
  borderRadius = RADIUS.card,
}) => {
  const opacityAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 750,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.3,
          duration: 750,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();

    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={[
        styles.shimmerBase,
        {
          height,
          width: width as any,
          borderRadius,
          opacity: opacityAnim,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  shimmerBase: {
    backgroundColor: PALETTE.ground2,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    marginVertical: 6,
  },
});
