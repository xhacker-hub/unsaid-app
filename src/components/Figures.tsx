import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, {
  G,
  Path,
  Rect,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';
import { PALETTE } from '../theme/tokens';

export type FigureExpression = 'nervous' | 'shy' | 'happy' | 'waiting' | 'sideBySide';

interface FiguresProps {
  expression?: FigureExpression;
  size?: 'small' | 'medium' | 'large';
  showThoughts?: boolean;
}

export const Figures: React.FC<FiguresProps> = ({
  expression = 'shy',
  size = 'medium',
  showThoughts = true,
}) => {
  const isHappy = expression === 'happy';
  const isWaiting = expression === 'waiting';
  const isNervous = expression === 'nervous' || expression === 'shy';

  const width = size === 'large' ? 320 : size === 'small' ? 180 : 250;
  const height = size === 'large' ? 220 : size === 'small' ? 130 : 180;

  return (
    <View
      style={[styles.container, { width, height }]}
      accessibilityLabel={`Two paper cutout figures sitting on a chai bench. Mode: ${expression}.`}
    >
      <Svg viewBox="0 0 320 220" width="100%" height="100%">
        <Defs>
          <LinearGradient id="roseGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={PALETTE.rose} />
            <Stop offset="1" stopColor="#8E354B" />
          </LinearGradient>
          <LinearGradient id="wineGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={PALETTE.wine} />
            <Stop offset="1" stopColor="#631E35" />
          </LinearGradient>
        </Defs>

        {/* --- LEFT FIGURE (BOY IN ROSE KURTA) --- */}
        <G
          id="boy"
          transform={
            isHappy
              ? 'translate(30, 0)' // Slide closer when happy
              : 'translate(0, 0)'
          }
        >
          {/* Rose Kurta Body */}
          <Path
            d="M 60 130 C 50 145, 45 180, 42 210 L 118 210 C 115 180, 110 145, 100 130 Z"
            fill="url(#roseGrad)"
            stroke={PALETTE.ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Kurta Collar & Placket */}
          <Path
            d="M 75 130 L 75 160 M 70 130 L 80 130"
            stroke={PALETTE.cloud}
            strokeWidth="2"
          />

          {/* Boy Neck */}
          <Rect
            x="73"
            y="115"
            width="14"
            height="18"
            fill={PALETTE.paper}
            stroke={PALETTE.ink}
            strokeWidth="2"
          />

          {/* Boy Head (Torn Open at Top - Section 7.4) */}
          {/* Paper cutout face with ragged open crown where thoughts spill */}
          <Path
            d="M 62 100 C 60 115, 70 122, 80 122 C 90 122, 100 115, 98 100 C 97 88, 93 84, 98 76 L 90 80 L 84 73 L 78 81 L 72 74 L 66 82 C 63 88, 62 94, 62 100 Z"
            fill={PALETTE.paper}
            stroke={PALETTE.ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Spilling thoughts fragments (floating small paper scraps) */}
          {showThoughts && (
            <G id="spillingThoughts">
              <Rect
                x="88"
                y="60"
                width="8"
                height="6"
                fill={PALETTE.cloud}
                stroke={PALETTE.ink}
                strokeWidth="1.2"
                transform="rotate(15 92 63)"
              />
              <Rect
                x="76"
                y="54"
                width="10"
                height="5"
                fill={PALETTE.cloud}
                stroke={PALETTE.ink}
                strokeWidth="1.2"
                transform="rotate(-12 81 56)"
              />
              <Rect
                x="65"
                y="63"
                width="7"
                height="5"
                fill={PALETTE.cloud}
                stroke={PALETTE.ink}
                strokeWidth="1.2"
                transform="rotate(24 68 65)"
              />
            </G>
          )}

          {/* Boy Arm rubbing neck when nervous (Section 7.4) */}
          {isNervous && (
            <Path
              d="M 52 145 C 42 125, 48 105, 60 102"
              fill="none"
              stroke={PALETTE.rose}
              strokeWidth="10"
              strokeLinecap="round"
            />
          )}

          {/* Boy Face Expressions */}
          {isHappy ? (
            // Happy "^ ^" closed laughing eyes & open warm smile
            <G id="boyHappyFace">
              <Path
                d="M 68 96 L 73 92 L 78 96"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <Path
                d="M 82 96 L 87 92 L 92 96"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Open smile */}
              <Path
                d="M 72 108 C 76 116, 84 116, 88 108 Z"
                fill={PALETTE.ink}
                stroke={PALETTE.ink}
                strokeWidth="1.5"
              />
            </G>
          ) : (
            // Shy / Nervous: Bashful sideways glance toward her, soft gentle brows, shy half-smile, gentle neck rub
            <G id="boyNervousFace">
              {/* Soft, gentle raised brows (not angry scowl) */}
              <Path
                d="M 67 90 Q 72 86 77 88"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <Path
                d="M 83 88 Q 88 86 93 90"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              {/* Sweet bashful eyes looking sideways toward her */}
              <Circle cx="74" cy="96" r="3.2" fill={PALETTE.ink} />
              <Circle cx="88" cy="96" r="3.2" fill={PALETTE.ink} />
              <Circle cx="75.2" cy="94.8" r="1.1" fill={PALETTE.cloud} />
              <Circle cx="89.2" cy="94.8" r="1.1" fill={PALETTE.cloud} />

              {/* Soft subtle warmth on cheeks (shy touch) */}
              <Ellipse cx="69" cy="102" rx="4" ry="2.2" fill="#E89CAE" opacity="0.65" />
              <Ellipse cx="92" cy="102" rx="4" ry="2.2" fill="#E89CAE" opacity="0.65" />

              {/* Sweet, hesitant shy smile (replaces zigzag grimace) */}
              <Path
                d="M 75 108 Q 80 113 86 108"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M 86 108 Q 87.5 106 88 107.5"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.5"
                strokeLinecap="round"
              />

              {/* Gentle sweat drop showing endearing nervous bashfulness */}
              <Path
                d="M 98 88 C 96 92, 99 96, 102 96 C 105 96, 107 92, 105 88 C 103 85, 100 85, 98 88 Z"
                fill="#87CEEB"
                stroke={PALETTE.ink}
                strokeWidth="1"
              />
            </G>
          )}
        </G>

        {/* --- RIGHT FIGURE (GIRL IN WINE KURTA & DUPATTA) --- */}
        <G
          id="girl"
          transform={
            isHappy
              ? 'translate(-30, 0)' // Slide closer when happy
              : 'translate(0, 0)'
          }
        >
          {/* Long Hair behind shoulders (Section 7.4) */}
          <Path
            d="M 215 90 C 205 110, 202 165, 206 185 L 254 185 C 258 165, 255 110, 245 90 Z"
            fill={PALETTE.ink}
          />

          {/* Wine Kurta Body */}
          <Path
            d="M 220 130 C 210 145, 205 180, 202 210 L 278 210 C 275 180, 270 145, 260 130 Z"
            fill="url(#wineGrad)"
            stroke={PALETTE.ink}
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* Dupatta drape across shoulder */}
          <Path
            d="M 218 135 C 228 150, 252 170, 272 185 L 265 205 C 245 190, 222 170, 212 155 Z"
            fill="#54162B"
            stroke={PALETTE.ink}
            strokeWidth="1.5"
          />

          {/* Girl Neck */}
          <Rect
            x="233"
            y="115"
            width="14"
            height="18"
            fill={PALETTE.paper}
            stroke={PALETTE.ink}
            strokeWidth="2"
          />

          {/* Girl Face (Paper Cutout) */}
          <Ellipse
            cx="240"
            cy="100"
            rx="18"
            ry="20"
            fill={PALETTE.paper}
            stroke={PALETTE.ink}
            strokeWidth="2.5"
          />

          {/* Smooth Rounded Hair with Centre Parting (Section 7.4) */}
          <Path
            d="M 222 98 C 222 80, 230 74, 240 78 C 250 74, 258 80, 258 98 C 254 88, 246 83, 240 83 C 234 83, 226 88, 222 98 Z"
            fill={PALETTE.ink}
          />

          {/* Girl Face Expressions */}
          {isHappy ? (
            // Happy "^ ^" closed laughing eyes & open smile
            <G id="girlHappyFace">
              <Path
                d="M 228 96 L 233 92 L 238 96"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <Path
                d="M 242 96 L 247 92 L 252 96"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              {/* Open smile */}
              <Path
                d="M 233 108 C 237 116, 243 116, 247 108 Z"
                fill={PALETTE.ink}
                stroke={PALETTE.ink}
                strokeWidth="1.5"
              />
            </G>
          ) : isWaiting ? (
            // Waiting/Thinking: Hand to chin
            <G id="girlWaitingFace">
              <Circle cx="233" cy="96" r="3" fill={PALETTE.ink} />
              <Circle cx="247" cy="96" r="3" fill={PALETTE.ink} />
              <Path
                d="M 236 109 Q 240 107 244 109"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2"
                strokeLinecap="round"
              />
            </G>
          ) : (
            // Shy / Nervous: Sweet bashful sideways glance toward him, soft gentle brows, shy smile
            <G id="girlNervousFace">
              {/* Soft, gentle raised brows (not angry scowl) */}
              <Path
                d="M 227 90 Q 232 86 237 88"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <Path
                d="M 243 88 Q 248 86 253 90"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.8"
                strokeLinecap="round"
              />

              {/* Sweet bashful eyes peeking sideways toward him */}
              <Circle cx="232" cy="96" r="3.2" fill={PALETTE.ink} />
              <Circle cx="246" cy="96" r="3.2" fill={PALETTE.ink} />
              <Circle cx="230.8" cy="94.8" r="1.1" fill={PALETTE.cloud} />
              <Circle cx="244.8" cy="94.8" r="1.1" fill={PALETTE.cloud} />

              {/* Soft subtle warmth on cheeks (shy touch) */}
              <Ellipse cx="226" cy="102" rx="4" ry="2.2" fill="#E89CAE" opacity="0.65" />
              <Ellipse cx="252" cy="102" rx="4" ry="2.2" fill="#E89CAE" opacity="0.65" />

              {/* Sweet, hesitant shy smile (replaces zigzag grimace) */}
              <Path
                d="M 235 108 Q 240 113 245 108"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="2"
                strokeLinecap="round"
              />
              <Path
                d="M 234 107.5 Q 234.5 106 235 108"
                fill="none"
                stroke={PALETTE.ink}
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </G>
          )}
        </G>
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
