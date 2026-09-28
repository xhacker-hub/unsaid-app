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
import { PillButton } from '../components/PillButton';
import { BandChip } from '../components/BandChip';
import { useApp } from '../context/AppContext';
import { calculateQuestionAlignment } from '../scoring/compatibility';

export const TopicDetailScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    topics,
    questions,
    selectedTopicForDetail,
    activeUserAnswers,
    activeUser,
    partnerUser,
    userConsentB,
    topicShares,
    toggleTopicShare,
    saveToNextChai,
  } = useApp();

  const topic = topics.find((t) => t.id === selectedTopicForDetail) || topics[0];
  const topicQuestions = questions.filter((q) => q.topicId === topic.id);

  // Check if raw answer sharing is enabled for sensitive topics
  const isSensitive = topic.sensitive;
  const showRawAnswers = !isSensitive || Boolean(topicShares[topic.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header matching website Phone 2 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          accessibilityLabel="Back to compatibility chart"
        >
          <Text style={[styles.backBtnText, getGroteskFont('500')]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerLabel, getGroteskFont('600')]}>
          YOUR CHART · {topic.name.toUpperCase()}
        </Text>

        <View style={styles.emptyPlaceholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.topicTitle, getGroteskFont('700')]}>
          {topic.name}
        </Text>

        {/* Sensitive Topic Privacy Notice & Toggle */}
        {isSensitive && (
          <View style={styles.sensitiveBox}>
            <View style={styles.sensitiveTextRow}>
              <Text style={[styles.sensitiveTitle, getGroteskFont('600')]}>
                Sensitive Topic Privacy
              </Text>
              <Text style={[styles.sensitiveDesc, getGroteskFont('400')]}>
                {showRawAnswers
                  ? 'Your answers are visible to your partner for this topic.'
                  : 'By default, sensitive topics only show whether you match, not word-for-word answers.'}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => toggleTopicShare(topic.id)}
              style={[
                styles.shareToggleBtn,
                showRawAnswers ? styles.shareToggleActive : styles.shareToggleInactive,
              ]}
            >
              <Text
                style={[
                  styles.shareToggleText,
                  getGroteskFont('600'),
                  showRawAnswers ? styles.shareTextActive : styles.shareTextInactive,
                ]}
              >
                {showRawAnswers ? 'Hide my answers' : 'Show my answers in this topic'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Question-level comparison cards */}
        <View style={styles.questionsList}>
          {topicQuestions.map((q, idx) => {
            const ansA = activeUserAnswers[q.id];
            // Partner answer mock lookup
            const partnerAns =
              activeUser.id === 'user_arjun'
                ? require('../data/mockState').INITIAL_ANSWERS_MEERA[q.id]
                : require('../data/mockState').INITIAL_ANSWERS_ARJUN[q.id];

            const alignmentRes = calculateQuestionAlignment(q, ansA, partnerAns);

            const isMatch = alignmentRes.alignment >= 0.8;
            const isDifferent = alignmentRes.alignment < 0.6 && !alignmentRes.isSkipped && !alignmentRes.isInPerson;
            const isInPerson = alignmentRes.isInPerson;
            const isSkipped = alignmentRes.isSkipped;

            return (
              <View key={q.id} style={styles.questionCard}>
                <View style={styles.qHeader}>
                  <Text style={[styles.qIndex, getGroteskFont('600')]}>
                    QUESTION {idx + 1}
                  </Text>
                  {alignmentRes.dealbreakerConflict && (
                    <View style={styles.dealbreakerBadge}>
                      <Text style={[styles.dealbreakerBadgeText, getGroteskFont('600')]}>
                        Important to one of you
                      </Text>
                    </View>
                  )}
                </View>

                <Text style={[styles.qText, getGroteskFont('600')]}>
                  {q.text}
                </Text>

                {/* Summary status line (Section 9) */}
                <View style={styles.statusLineRow}>
                  {isInPerson ? (
                    <Text style={[styles.statusLine, { color: PALETTE.mist }]}>
                      • One of you preferred to discuss this in person
                    </Text>
                  ) : isSkipped ? (
                    <Text style={[styles.statusLine, { color: PALETTE.mist }]}>
                      • Not answered yet
                    </Text>
                  ) : isMatch ? (
                    <Text style={[styles.statusLine, { color: '#98D8A0' }]}>
                      ✓ Both of you are on the same page
                    </Text>
                  ) : (
                    <Text style={[styles.statusLine, { color: PALETTE.marigold }]}>
                      Different answers. Ask about this first.
                    </Text>
                  )}
                </View>

                {/* Answer boxes: You: / Them: */}
                <View style={styles.answersContainer}>
                  {showRawAnswers ? (
                    <>
                      {/* You Box */}
                      <View style={styles.answerBox}>
                        <Text style={[styles.answerOwner, getGroteskFont('600')]}>
                          YOU ({activeUser.displayName}):
                        </Text>
                        <Text style={[styles.answerValue, getGroteskFont('400')]}>
                          {ansA?.inPerson
                            ? 'Discuss in person'
                            : ansA?.skipped
                            ? 'Skipped for now'
                            : Array.isArray(ansA?.value)
                            ? ansA.value.join(', ')
                            : String(ansA?.value ?? 'Not answered yet')}
                        </Text>
                        {ansA?.note && ansA.noteShared && (
                          <Text style={[styles.sharedNote, getGroteskFont('400')]}>
                            Note: "{ansA.note}"
                          </Text>
                        )}
                      </View>

                      {/* Partner Box */}
                      <View style={styles.answerBox}>
                        <Text style={[styles.answerOwner, getGroteskFont('600')]}>
                          THEM ({partnerUser.displayName}):
                        </Text>
                        <Text style={[styles.answerValue, getGroteskFont('400')]}>
                          {partnerAns?.inPerson
                            ? 'Discuss in person'
                            : partnerAns?.skipped
                            ? 'Skipped for now'
                            : Array.isArray(partnerAns?.value)
                            ? partnerAns.value.join(', ')
                            : String(partnerAns?.value ?? 'Not answered yet')}
                        </Text>
                        {partnerAns?.note && partnerAns.noteShared && (
                          <Text style={[styles.sharedNote, getGroteskFont('400')]}>
                            Note: "{partnerAns.note}"
                          </Text>
                        )}
                      </View>
                    </>
                  ) : (
                    /* Sensitive topic comparison only (Section 5 & 9) */
                    <View style={styles.privacyComparisonBox}>
                      <Text style={[styles.privacyComparisonText, getGroteskFont('500')]}>
                        {isMatch
                          ? 'You both agree on this topic.'
                          : 'You differ here. Turn on "Show my answers" above if you wish to reveal details.'}
                      </Text>
                    </View>
                  )}
                </View>

                {/* Prompt to save to next meeting */}
                {isDifferent && (
                  <TouchableOpacity
                    onPress={() => saveToNextChai(q.id)}
                    style={styles.saveChaiPrompt}
                  >
                    <Text style={[styles.saveChaiPromptText, getGroteskFont('600')]}>
                      + Save suggested question to Next Chai
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            );
          })}
        </View>

        {/* Update Answers Button */}
        <View style={styles.updateSection}>
          <PillButton
            title="Update answers after talking →"
            variant="secondaryOutline"
            onPress={() => navigateTo('UPDATE_ANSWERS')}
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
  emptyPlaceholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  topicTitle: {
    color: PALETTE.paper,
    fontSize: 28,
    marginBottom: 12,
  },
  sensitiveBox: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.wine,
    padding: 14,
    marginBottom: 16,
  },
  sensitiveTextRow: {
    marginBottom: 10,
  },
  sensitiveTitle: {
    color: PALETTE.paper,
    fontSize: 14,
    marginBottom: 4,
  },
  sensitiveDesc: {
    color: PALETTE.mist,
    fontSize: 13,
    lineHeight: 18,
  },
  shareToggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: RADIUS.pill,
    alignSelf: 'flex-start',
    borderWidth: 1,
  },
  shareToggleActive: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  shareToggleInactive: {
    backgroundColor: 'transparent',
    borderColor: PALETTE.mist,
  },
  shareToggleText: {
    fontSize: 12,
  },
  shareTextActive: {
    color: PALETTE.ink,
  },
  shareTextInactive: {
    color: PALETTE.paper,
  },
  questionsList: {
    gap: 16,
  },
  questionCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 16,
  },
  qHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  qIndex: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
  },
  dealbreakerBadge: {
    backgroundColor: PALETTE.wine,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: RADIUS.pill,
  },
  dealbreakerBadgeText: {
    color: PALETTE.paper,
    fontSize: 11,
  },
  qText: {
    color: PALETTE.paper,
    fontSize: 17,
    lineHeight: 23,
    marginBottom: 8,
  },
  statusLineRow: {
    marginBottom: 12,
  },
  statusLine: {
    fontSize: 13,
    fontWeight: '600',
  },
  answersContainer: {
    gap: 8,
  },
  answerBox: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.paper,
    borderWidth: 1,
    borderColor: PALETTE.line,
    padding: 10,
  },
  answerOwner: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  answerValue: {
    color: PALETTE.paper,
    fontSize: 14,
  },
  sharedNote: {
    color: PALETTE.marigold,
    fontSize: 12,
    fontStyle: 'italic',
    marginTop: 4,
  },
  privacyComparisonBox: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.paper,
    padding: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  privacyComparisonText: {
    color: PALETTE.paper,
    fontSize: 13,
    lineHeight: 18,
  },
  saveChaiPrompt: {
    marginTop: 12,
    paddingVertical: 6,
  },
  saveChaiPromptText: {
    color: PALETTE.marigold,
    fontSize: 13,
  },
  updateSection: {
    marginTop: 24,
    alignItems: 'center',
  },
});
