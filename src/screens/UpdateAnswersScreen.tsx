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
import { OptionCard } from '../components/OptionCard';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const UpdateAnswersScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    questions,
    topics,
    activeUserAnswers,
    saveCurrentAnswer,
  } = useApp();

  // Find questions with gaps (e.g. debt or chores or living)
  const [selectedQuestionId, setSelectedQuestionId] = useState<string>('money_debt');
  const activeQuestion = questions.find((q) => q.id === selectedQuestionId) || questions[0];
  const activeTopic = topics.find((t) => t.id === activeQuestion.topicId);

  const existingAns = activeUserAnswers[activeQuestion.id];
  const [currentVal, setCurrentVal] = useState<any>(existingAns?.value);
  const [updatedSuccess, setUpdatedSuccess] = useState(false);

  const handleSaveUpdate = () => {
    saveCurrentAnswer(
      activeQuestion.id,
      currentVal,
      existingAns?.importance || 2,
      existingAns?.dealbreaker || false,
      'Updated together after discussing over chai.'
    );
    setUpdatedSuccess(true);
    setTimeout(() => {
      navigateTo('COMPATIBILITY_CHART');
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={goBack}
          style={styles.backBtn}
          accessibilityLabel="Back"
        >
          <Text style={[styles.backBtnText, getGroteskFont('500')]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerLabel, getGroteskFont('600')]}>
          UPDATE ANSWERS
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={[styles.title, getGroteskFont('700')]}>
          Did you talk about this?
        </Text>
        <Text style={[styles.subtitle, getGroteskFont('400')]}>
          After having your conversation in person, you can update your answer here.
          Your chart will refresh for both of you with the tag "Updated after you talked".
        </Text>

        {/* Question Selector Pills */}
        <Text style={[styles.selectLabel, getGroteskFont('600')]}>
          SELECT QUESTION DISCUSSED:
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.selectorRow}
        >
          {questions.slice(0, 5).map((q) => {
            const isSelected = q.id === selectedQuestionId;
            return (
              <TouchableOpacity
                key={q.id}
                onPress={() => {
                  setSelectedQuestionId(q.id);
                  setCurrentVal(activeUserAnswers[q.id]?.value);
                  setUpdatedSuccess(false);
                }}
                style={[
                  styles.selectorPill,
                  isSelected && styles.selectorPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.selectorPillText,
                    getGroteskFont('500'),
                    isSelected && styles.selectorPillTextActive,
                  ]}
                >
                  {q.text.substring(0, 24)}...
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Current Question & Options */}
        <View style={styles.questionCard}>
          <Text style={[styles.topicBadge, getGroteskFont('600')]}>
            TOPIC: {activeTopic?.name.toUpperCase()}
          </Text>

          <Text style={[styles.questionText, getGroteskFont('600')]}>
            {activeQuestion.text}
          </Text>

          <View style={styles.optionsList}>
            {activeQuestion.options.map((opt) => (
              <OptionCard
                key={opt}
                label={opt}
                selected={currentVal === opt}
                onPress={() => setCurrentVal(opt)}
              />
            ))}
          </View>
        </View>

        {updatedSuccess && (
          <View style={styles.successBox}>
            <Text style={[styles.successText, getGroteskFont('600')]}>
              ✓ Chart refreshed: "Updated after you talked"
            </Text>
          </View>
        )}

        <View style={styles.actions}>
          <PillButton
            title="Save updated answer →"
            variant="primaryOnMaroon"
            onPress={handleSaveUpdate}
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
  placeholder: {
    width: 36,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 28,
    marginBottom: 6,
  },
  subtitle: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  selectLabel: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  selectorRow: {
    gap: 8,
    marginBottom: 16,
  },
  selectorPill: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  selectorPillActive: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  selectorPillText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  selectorPillTextActive: {
    color: PALETTE.ink,
    fontWeight: 'bold',
  },
  questionCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 18,
    marginBottom: 20,
  },
  topicBadge: {
    color: PALETTE.marigold,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  questionText: {
    color: PALETTE.paper,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 16,
  },
  optionsList: {
    gap: 4,
  },
  successBox: {
    backgroundColor: '#2D4E35',
    borderRadius: RADIUS.card,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },
  successText: {
    color: '#D4EED8',
    fontSize: 14,
  },
  actions: {
    width: '100%',
  },
});
