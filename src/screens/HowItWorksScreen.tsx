import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { PALETTE, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { StripTitle } from '../components/StripTitle';
import { TornCard } from '../components/TornCard';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const HowItWorksScreen: React.FC = () => {
  const { navigateTo } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Strip title on marigold screen (Section 7.3 & 9) */}
        <StripTitle lines={['How Unsaid', 'helps you ask.']} fontSize={32} />

        <Text style={[styles.subtitle, getGroteskFont('500')]}>
          Three steps to replace polite small talk with real confidence.
        </Text>

        {/* 3 Stacked Card Groups with Alternating Tilts */}
        <View style={styles.cardsStack}>
          {/* Card 1: Answer Privately */}
          <TornCard variant="cream" tilt="left">
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={[styles.stepNumber, getGroteskFont('700')]}>1</Text>
              </View>
              <Text style={[styles.cardTitle, getGroteskFont('700')]}>
                Answer privately
              </Text>
            </View>
            <Text style={[styles.cardBody, getGroteskFont('400')]}>
              Each of you answers questions alone. No one sees your individual answers
              until both are completely done. Take 15 minutes in your own time.
            </Text>
          </TornCard>

          {/* Card 2: See your chart */}
          <TornCard variant="cream" tilt="right">
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={[styles.stepNumber, getGroteskFont('700')]}>2</Text>
              </View>
              <Text style={[styles.cardTitle, getGroteskFont('700')]}>
                See your chart
              </Text>
            </View>
            <Text style={[styles.cardBody, getGroteskFont('400')]}>
              Unsaid highlights topic by topic where your lives align naturally, and where
              your expectations differ. No pass/fail score. No judgment.
            </Text>
          </TornCard>

          {/* Card 3: Ask what matters */}
          <TornCard variant="cream" tilt="slight">
            <View style={styles.cardHeader}>
              <View style={styles.stepBadge}>
                <Text style={[styles.stepNumber, getGroteskFont('700')]}>3</Text>
              </View>
              <Text style={[styles.cardTitle, getGroteskFont('700')]}>
                Ask what matters
              </Text>
            </View>
            <Text style={[styles.cardBody, getGroteskFont('400')]}>
              For every gap, we suggest the exact, calm questions to bring to your next
              chai meeting, so you walk in knowing what to say.
            </Text>
          </TornCard>
        </View>

        <View style={styles.buttonWrapper}>
          <PillButton
            title="Next →"
            variant="primaryOnLight" // Ink button on marigold screen
            onPress={() => navigateTo('PRIVACY_PROMISES')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.marigold, // Section 7.1: Marigold is the moment screen
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  subtitle: {
    color: PALETTE.amberTextDark,
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
    maxWidth: 320,
  },
  cardsStack: {
    width: '100%',
    maxWidth: 340,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: PALETTE.ink,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  stepNumber: {
    color: PALETTE.marigold,
    fontSize: 14,
  },
  cardTitle: {
    fontSize: 18,
    color: PALETTE.ink,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 21,
    color: PALETTE.ink,
    opacity: 0.9,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 320,
    marginTop: 24,
  },
});
