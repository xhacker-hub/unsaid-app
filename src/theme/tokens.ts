/**
 * Unsaid Design System Tokens (Section 7)
 * Strictly matches the marketing website and product specification.
 */

export const PALETTE = {
  // Screen backgrounds
  ground: '#3A0C17', // default screen background (deep sindoor maroon)
  ground2: '#4D1322', // raised sections, stall back wall, secondary surfaces

  // Content surfaces & text
  paper: '#FBEEDC', // primary text on maroon, cream paper cards, wordmark
  cloud: '#FFF8EE', // thought clouds, phone/card faces, input backgrounds
  ink: '#24060D', // outlines, text on light surfaces, black strips
  mist: '#E6BFAF', // secondary text on maroon
  line: '#6B2437', // hairlines and chip borders on maroon

  // Accents & characters
  rose: '#A8465E', // his kurta, accent cards
  wine: '#7E2C47', // her kurta, accent cards
  marigold: '#FFB22E', // the "moment" colour: reveal flood, question-process screens, strip text, counters
  amberText: '#6A3A12', // secondary text and labels on marigold
  amberTextDark: '#7A3E0E', // alternate high-contrast amber label

  // Physical world (stall & kulhads)
  wood: ['#A8663A', '#7A4424', '#5A3019', '#8A4E2E', '#6B3A26'],
  kulhad: '#B5653A',
  chai: '#D9A26C',
  steam: '#FFF8EE99',

  // Utility
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlayDark: 'rgba(36, 6, 13, 0.85)',
} as const;

export const TYPOGRAPHY = {
  // Font family names (resolved by fonts loader)
  families: {
    groteskRegular: 'FamiljenGrotesk_400Regular',
    groteskMedium: 'FamiljenGrotesk_500Medium',
    groteskSemiBold: 'FamiljenGrotesk_600SemiBold',
    groteskBold: 'FamiljenGrotesk_700Bold',
    handRegular: 'ShantellSans_400Regular',
    handMedium: 'ShantellSans_500Medium',
  },

  // Type scale (Section 7.2)
  sizes: {
    display: 44, // 40-96 scale
    displayLg: 56,
    h2: 32, // 32-40
    h3: 22, // 22-24
    body: 16, // 16-17
    bodyLg: 17,
    small: 14, // 13-14
    label: 12, // 11-13
  },

  lineHeights: {
    display: 0.92,
    h2: 1.15,
    h3: 1.25,
    body: 1.5,
    small: 1.4,
    label: 1.2,
  },

  letterSpacing: {
    wordmark: -0.065, // em
    display: -0.045, // em
    h3: -0.02, // em
    normal: 0,
    label: 0.12, // +0.12em tracking
  },
} as const;

export const RADIUS = {
  paper: 6, // minimal paper radius
  card: 10,
  input: 12, // 12px radius
  cloud: 24,
  pill: 999, // 999px for buttons, chips, indicators
} as const;

export const BORDERS = {
  hairline: 1,
  line: 1.5, // 1.5px line border for chips
  ink2px: 2, // 2px ink border for cards and inputs
  ink3px: 3,
} as const;

export const MOTION = {
  // Trail-off thought cloud cycle timings (ms)
  trailDots: 260,
  cloudScaleUp: 420,
  charTyping: 45,
  spacePause: 80,
  commaPause: 220,
  emDashHold: 1500,
  cloudRetract: 520,
  headDip: 700,
  headReturn: 900,
  cyclePause: 2000,
  staggerFigures: 1200,

  // Bumblebee reveal
  ringStaggerPercent: 0.06,
  ringDuration: 900,
  stripRiseDuration: 600,
  stripRiseDistance: 40,

  // Chart bars
  chartGrowDuration: 600,

  // Reduced motion fallback
  reducedFade: 200,
} as const;

export const TILTS = {
  tiltLeft: '-3deg',
  tiltRight: '3deg',
  tiltSlight: '-1.5deg',
  stripLeft: '-2deg',
  stripRight: '1.5deg',
} as const;
