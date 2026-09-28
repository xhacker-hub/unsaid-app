import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { PALETTE } from '../theme/tokens';
import { Figures, FigureExpression } from './Figures';

interface ChaiStallSceneProps {
  expression?: FigureExpression;
  showAwning?: boolean;
}

export const ChaiStallScene: React.FC<ChaiStallSceneProps> = ({
  expression = 'shy',
  showAwning = true,
}) => {
  return (
    <View style={styles.sceneContainer}>
      {/* Background Chai Stall details */}
      <Svg viewBox="0 0 360 170" width="100%" height={170} style={styles.stallSvg}>
        <Defs>
          <LinearGradient id="benchGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={PALETTE.wood[0]} />
            <Stop offset="1" stopColor={PALETTE.wood[2]} />
          </LinearGradient>
        </Defs>

        {/* 1. Striped Rose/Cream Awning at the top (Section 7.4) */}
        {showAwning && (
          <G id="awning">
            {/* Awning Valance with scalloped bottom edge */}
            <Path
              d="M 10 0 L 350 0 L 350 35 C 330 42, 310 42, 290 35 C 270 42, 250 42, 230 35 C 210 42, 190 42, 170 35 C 150 42, 130 42, 110 35 C 90 42, 70 42, 50 35 C 30 42, 10 42, 10 35 Z"
              fill={PALETTE.rose}
              stroke={PALETTE.ink}
              strokeWidth="2"
            />
            {/* Alternating Cream Stripes */}
            <Path
              d="M 50 0 L 90 0 L 80 37 L 60 37 Z"
              fill={PALETTE.paper}
              stroke={PALETTE.ink}
              strokeWidth="1.2"
            />
            <Path
              d="M 130 0 L 170 0 L 160 37 L 140 37 Z"
              fill={PALETTE.paper}
              stroke={PALETTE.ink}
              strokeWidth="1.2"
            />
            <Path
              d="M 210 0 L 250 0 L 240 37 L 220 37 Z"
              fill={PALETTE.paper}
              stroke={PALETTE.ink}
              strokeWidth="1.2"
            />
            <Path
              d="M 290 0 L 330 0 L 320 37 L 300 37 Z"
              fill={PALETTE.paper}
              stroke={PALETTE.ink}
              strokeWidth="1.2"
            />
          </G>
        )}

        {/* 2. CHAI ₹10 Board at far left (Section 7.4) */}
        <G id="chaiBoard" transform="translate(14, 52) rotate(-3)">
          <Rect
            x="0"
            y="0"
            width="68"
            height="34"
            fill={PALETTE.ground2}
            stroke={PALETTE.ink}
            strokeWidth="2"
            rx="4"
          />
          <SvgText
            x="34"
            y="17"
            fill={PALETTE.marigold}
            fontSize="11"
            fontWeight="bold"
            textAnchor="middle"
          >
            CHAI
          </SvgText>
          <SvgText
            x="34"
            y="29"
            fill={PALETTE.paper}
            fontSize="10"
            fontWeight="bold"
            textAnchor="middle"
          >
            ₹10
          </SvgText>
        </G>

        {/* 3. Kettle & Chai Stall Jars at far right */}
        <G id="chaiKettle" transform="translate(295, 58)">
          {/* Chai Jar */}
          <Rect
            x="32"
            y="6"
            width="18"
            height="26"
            fill={PALETTE.cloud}
            stroke={PALETTE.ink}
            strokeWidth="1.5"
            rx="3"
            opacity="0.8"
          />
          {/* Brass Kettle Body */}
          <Path
            d="M 6 18 C 6 8, 26 8, 26 18 L 28 32 L 4 32 Z"
            fill="#C98B32"
            stroke={PALETTE.ink}
            strokeWidth="1.5"
          />
          {/* Spout */}
          <Path
            d="M 6 22 L 0 16 L 0 13 L 5 18"
            fill="#B27622"
            stroke={PALETTE.ink}
            strokeWidth="1.5"
          />
          {/* Handle */}
          <Path
            d="M 12 8 C 12 0, 20 0, 20 8"
            fill="none"
            stroke={PALETTE.ink}
            strokeWidth="2"
          />
        </G>

        {/* 4. Wooden Chai Bench (Section 7.4) */}
        <G id="bench" transform="translate(25, 126)">
          {/* Bench Legs */}
          <Rect x="20" y="22" width="10" height="22" fill={PALETTE.wood[3]} stroke={PALETTE.ink} strokeWidth="1.5" />
          <Rect x="280" y="22" width="10" height="22" fill={PALETTE.wood[3]} stroke={PALETTE.ink} strokeWidth="1.5" />
          {/* Bench Plank */}
          <Rect
            x="0"
            y="0"
            width="310"
            height="22"
            fill="url(#benchGrad)"
            stroke={PALETTE.ink}
            strokeWidth="2.5"
            rx="3"
          />
          {/* Wood grain lines */}
          <Path d="M 15 7 L 120 7 M 150 7 L 295 7" stroke={PALETTE.wood[1]} strokeWidth="1" opacity="0.6" />
          <Path d="M 30 14 L 280 14" stroke={PALETTE.wood[2]} strokeWidth="1" opacity="0.6" />
        </G>

        {/* 5. Two Kulhads with Steam between them on the bench */}
        <G id="kulhads" transform="translate(160, 102)">
          {/* Left Kulhad (Clay Cup) */}
          <Path
            d="M 6 12 L 18 12 L 15 24 L 9 24 Z"
            fill={PALETTE.kulhad}
            stroke={PALETTE.ink}
            strokeWidth="1.5"
          />
          <Path d="M 6 12 Q 12 14 18 12" fill={PALETTE.chai} />

          {/* Right Kulhad */}
          <Path
            d="M 24 12 L 36 12 L 33 24 L 27 24 Z"
            fill={PALETTE.kulhad}
            stroke={PALETTE.ink}
            strokeWidth="1.5"
          />
          <Path d="M 24 12 Q 30 14 36 12" fill={PALETTE.chai} />

          {/* Rising Steam */}
          <Path
            d="M 12 9 C 10 5, 14 3, 12 0"
            fill="none"
            stroke={PALETTE.cloud}
            strokeWidth="1.5"
            opacity="0.75"
            strokeLinecap="round"
          />
          <Path
            d="M 30 9 C 28 5, 32 3, 30 0"
            fill="none"
            stroke={PALETTE.cloud}
            strokeWidth="1.5"
            opacity="0.75"
            strokeLinecap="round"
          />
        </G>
      </Svg>

      {/* Characters sitting on the bench */}
      <View style={styles.figuresWrapper}>
        <Figures expression={expression} size="medium" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sceneContainer: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
    marginVertical: 4,
  },
  stallSvg: {
    width: '100%',
    maxWidth: 400,
  },
  figuresWrapper: {
    position: 'absolute',
    top: 18,
    alignSelf: 'center',
    zIndex: 10,
  },
});
