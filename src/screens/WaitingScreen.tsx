import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { ChaiStallScene } from '../components/ChaiStallScene';
import { ThoughtCloud } from '../components/ThoughtCloud';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const WaitingScreen: React.FC = () => {
  const {
    navigateTo,
    partnerUser,
    reminderSent,
    sendGentleReminder,
    isPartnerFinished,
    setPartnerFinished,
  } = useApp();

  const partnerThinkingPhrases = [
    'I want to answer honestly, but—',
    'What if we look at the chart and—',
    'Taking a deep breath before—',
  ];

  const handlePartnerFinishedDemo = () => {
    setPartnerFinished(true);
    navigateTo('REVEAL');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        <View style={styles.contentCard}>
          <Text style={[styles.eyebrow, getGroteskFont('600')]}>
            ALL DONE
          </Text>

          <Text style={[styles.title, getGroteskFont('700')]}>
            You’re done.
          </Text>

          {/* Figures: One relaxed, one still thinking (Section 7.4 & 9) */}
          <View style={styles.sceneWrapper}>
            <ThoughtCloud phrases={partnerThinkingPhrases} side="right" />
            <ChaiStallScene expression="waiting" showAwning={false} />
          </View>

          <Text style={[styles.headline, getGroteskFont('700')]}>
            Waiting for {partnerUser.displayName} to finish.
          </Text>

          <Text style={[styles.body, getGroteskFont('400')]}>
            Neither of you can see any comparison until both finish. There is no partial peeking.
          </Text>

          {/* Gentle Reminder (Once only) */}
          <View style={styles.actions}>
            <PillButton
              title={reminderSent ? '✓ Quiet reminder sent' : 'Send a gentle reminder'}
              variant={reminderSent ? 'skipOutline' : 'secondaryOutline'}
              disabled={reminderSent}
              onPress={sendGentleReminder}
            />

            {/* Test Simulation trigger for demo */}
            <TouchableOpacity
              onPress={handlePartnerFinishedDemo}
              style={styles.simulateButton}
            >
              <Text style={[styles.simulateText, getGroteskFont('600')]}>
                ⚡ Simulate {partnerUser.displayName} Finished (Play Reveal) →
              </Text>
            </TouchableOpacity>
          </View>
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
  contentCard: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    marginTop: 10,
  },
  eyebrow: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    marginBottom: 4,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 32,
    marginBottom: 8,
  },
  sceneWrapper: {
    width: '100%',
    position: 'relative',
    marginVertical: 12,
  },
  headline: {
    color: PALETTE.paper,
    fontSize: 20,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  body: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    width: '100%',
    gap: 12,
  },
  simulateButton: {
    backgroundColor: PALETTE.ground2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.marigold,
    alignItems: 'center',
    marginTop: 4,
  },
  simulateText: {
    color: PALETTE.marigold,
    fontSize: 13,
  },
});
