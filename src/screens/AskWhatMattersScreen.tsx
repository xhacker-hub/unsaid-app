import React from 'react';
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
import { TornCard } from '../components/TornCard';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const AskWhatMattersScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    askItems,
    saveToNextChai,
    markTalked,
    dismissAsk,
  } = useApp();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          accessibilityLabel="Back to compatibility chart"
        >
          <Text style={[styles.backBtnText, getGroteskFont('500')]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerLabel, getGroteskFont('600')]}>
          CONVERSATION PROMPTS
        </Text>

        <TouchableOpacity
          onPress={() => navigateTo('NEXT_CHAI')}
          style={styles.headerNextChaiBtn}
        >
          <Text style={[styles.headerNextChaiText, getGroteskFont('600')]}>
            Next Chai ☕
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, getGroteskFont('700')]}>
          Ask what matters
        </Text>

        <Text style={[styles.subtitle, getGroteskFont('400')]}>
          Ordered by where you differed most. Each question is phrased to feel natural and easy to say out loud over chai.
        </Text>

        {/* Global How-to-Ask Tip Card */}
        <View style={styles.tipCard}>
          <Text style={[styles.tipCardTitle, getGroteskFont('600')]}>
            💡 THREE RULES FOR YOUR NEXT CHAI
          </Text>
          <Text style={[styles.tipCardBullet, getGroteskFont('400')]}>
            1. Listen first without jumping to defend or explain.
          </Text>
          <Text style={[styles.tipCardBullet, getGroteskFont('400')]}>
            2. It is completely fine to take a sip of chai and pause before answering.
          </Text>
          <Text style={[styles.tipCardBullet, getGroteskFont('400')]}>
            3. Disagreeing on preferences is normal. Honesty is what builds safety.
          </Text>
        </View>

        {/* Suggested Question Cards */}
        <View style={styles.questionsList}>
          {askItems.map((item, idx) => {
            const tilt = idx % 2 === 0 ? 'left' : 'right';

            return (
              <TornCard key={item.questionId} variant="cream" tilt={tilt}>
                {item.dealbreakerConflict && (
                  <View style={styles.dealbreakerFlag}>
                    <Text style={[styles.dealbreakerFlagText, getGroteskFont('700')]}>
                      🚩 High priority · Important to one of you
                    </Text>
                  </View>
                )}

                <Text style={[styles.suggestedQuestionText, getGroteskFont('600')]}>
                  "{item.suggestedText}"
                </Text>

                {/* Question specific coaching tip */}
                <View style={styles.coachingTipBox}>
                  <Text style={[styles.coachingTipLabel, getGroteskFont('600')]}>
                    HOW TO ASK IT:
                  </Text>
                  <Text style={[styles.coachingTipText, getGroteskFont('400')]}>
                    {item.tip}
                  </Text>
                </View>

                {/* 3 Actions: Save for next chai, We talked about this, Not now */}
                <View style={styles.actionsRow}>
                  {item.status === 'saved' ? (
                    <View style={styles.savedBadge}>
                      <Text style={[styles.savedBadgeText, getGroteskFont('600')]}>
                        ✓ Saved to Next Chai
                      </Text>
                    </View>
                  ) : item.status === 'talked' ? (
                    <View style={styles.talkedBadge}>
                      <Text style={[styles.talkedBadgeText, getGroteskFont('600')]}>
                        ✓ Marked as talked
                      </Text>
                    </View>
                  ) : (
                    <TouchableOpacity
                      onPress={() => saveToNextChai(item.questionId)}
                      style={styles.saveBtn}
                    >
                      <Text style={[styles.saveBtnText, getGroteskFont('600')]}>
                        + Save for next chai
                      </Text>
                    </TouchableOpacity>
                  )}

                  <View style={styles.subActions}>
                    <TouchableOpacity
                      onPress={() => markTalked(item.questionId)}
                      style={styles.subActionLink}
                    >
                      <Text style={[styles.subActionText, getGroteskFont('500')]}>
                        We talked
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => dismissAsk(item.questionId)}
                      style={styles.subActionLink}
                    >
                      <Text style={[styles.subActionText, getGroteskFont('500')]}>
                        Not now
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TornCard>
            );
          })}
        </View>

        <View style={styles.bottomNav}>
          <PillButton
            title="Open Next Chai List →"
            variant="primaryOnMaroon"
            onPress={() => navigateTo('NEXT_CHAI')}
          />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backBtnText: {
    color: PALETTE.paper,
    fontSize: 22,
  },
  headerLabel: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
  },
  headerNextChaiBtn: {
    backgroundColor: PALETTE.ground2,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.marigold,
  },
  headerNextChaiText: {
    color: PALETTE.marigold,
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 30,
    marginBottom: 6,
  },
  subtitle: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  tipCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 16,
    marginBottom: 18,
  },
  tipCardTitle: {
    color: PALETTE.marigold,
    fontSize: 12,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  tipCardBullet: {
    color: PALETTE.paper,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },
  questionsList: {
    gap: 12,
  },
  dealbreakerFlag: {
    backgroundColor: PALETTE.wine,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  dealbreakerFlagText: {
    color: PALETTE.paper,
    fontSize: 11,
  },
  suggestedQuestionText: {
    color: PALETTE.ink,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 10,
  },
  coachingTipBox: {
    backgroundColor: PALETTE.paper,
    borderRadius: RADIUS.paper,
    padding: 10,
    marginBottom: 12,
  },
  coachingTipLabel: {
    color: PALETTE.amberText,
    fontSize: 10,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  coachingTipText: {
    color: PALETTE.ink,
    fontSize: 13,
    lineHeight: 18,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EAD9C4',
    paddingTop: 10,
  },
  saveBtn: {
    backgroundColor: PALETTE.ink,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  saveBtnText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  savedBadge: {
    backgroundColor: '#2D4E35',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  savedBadgeText: {
    color: '#D4EED8',
    fontSize: 12,
  },
  talkedBadge: {
    backgroundColor: PALETTE.ground2,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
  },
  talkedBadgeText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  subActions: {
    flexDirection: 'row',
    gap: 12,
  },
  subActionLink: {
    paddingVertical: 4,
  },
  subActionText: {
    color: PALETTE.amberText,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  bottomNav: {
    marginTop: 24,
  },
});
