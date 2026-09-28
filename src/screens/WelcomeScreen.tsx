import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PALETTE, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { ChaiStallScene } from '../components/ChaiStallScene';
import { ThoughtCloud } from '../components/ThoughtCloud';
import { PillButton } from '../components/PillButton';
import { CounterPill } from '../components/CounterPill';
import { useApp } from '../context/AppContext';

export const WelcomeScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const boyPhrases = [
    'Before we go further, I need you to know that—',
    'I have never told my family about—',
    'What if we disagree on where to live, and—',
  ];

  const girlPhrases = [
    'I keep waiting for him to ask me something real, but—',
    'I am terrified that if we talk about money, you will think—',
    'There is something from my past that—',
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Wordmark with torn paper edge */}
        <Wordmark size="large" />

        <Text style={[styles.tagline, getGroteskFont('500')]}>
          The questions you can’t ask over chai.
        </Text>

        <CounterPill count={124800} label="questions answered privately" />

        {/* Chai Stall Scene with Nervous Figures & Animated Thought Clouds */}
        <View style={styles.sceneContainer}>
          <ThoughtCloud phrases={boyPhrases} side="left" staggerDelay={0} />
          <ThoughtCloud phrases={girlPhrases} side="right" staggerDelay={1200} />
          <ChaiStallScene expression="shy" showAwning={true} />
        </View>

        <Text style={[styles.subcopy, getGroteskFont('400')]}>
          A private, honest questionnaire for couples in arranged marriage.
          Answer alone, see where you align, and get the exact questions to ask next.
        </Text>

        {/* Primary and Secondary CTA Buttons */}
        <View style={styles.actions}>
          <PillButton
            title="Get started"
            variant="primaryOnMaroon"
            onPress={() => navigateTo('HOW_IT_WORKS')}
          />

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigateTo('PAIRING')}
            style={styles.secondaryLink}
          >
            <Text style={[styles.secondaryLinkText, getGroteskFont('500')]}>
              I have an invite code →
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.ground,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  tagline: {
    color: PALETTE.mist,
    fontSize: 18,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 12,
  },
  sceneContainer: {
    width: '100%',
    position: 'relative',
    marginVertical: 12,
  },
  subcopy: {
    color: PALETTE.mist,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 340,
    marginVertical: 16,
  },
  actions: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
    marginTop: 8,
  },
  secondaryLink: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  secondaryLinkText: {
    color: PALETTE.paper,
    fontSize: 15,
    textDecorationLine: 'underline',
  },
});
