import React, { useState, useEffect } from 'react';
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
import { ScaleSlider } from '../components/ScaleSlider';
import { ImportanceSelector } from '../components/ImportanceSelector';
import { DealbreakerToggle } from '../components/DealbreakerToggle';
import { PrivateNoteField } from '../components/PrivateNoteField';
import { ProgressBar } from '../components/ProgressBar';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';
import { HeavyGateScreen } from './HeavyGateScreen';

export const QuestionnaireScreen: React.FC = () => {
  const {
    navigateTo,
    goBack,
    canGoBack,
    questions,
    topics,
    commonTopicIds,
    activeUserAnswers,
    saveCurrentAnswer,
    skipCurrentQuestion,
    markInPerson,
    markPreferNotToSay,
  } = useApp();

  // Filter questions by common opted-in topics
  const activeQuestions = questions.filter((q) => commonTopicIds.has(q.topicId));

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showGate, setShowGate] = useState(false);
  const [gateTopicName, setGateTopicName] = useState('');

  const currentQ = activeQuestions[currentIndex] || activeQuestions[0];
  const currentTopic = topics.find((t) => t.id === currentQ?.topicId);

  // Existing answer state
  const existingAns = currentQ ? activeUserAnswers[currentQ.id] : undefined;

  const [selectedVal, setSelectedVal] = useState<any>(existingAns?.value);
  const [importance, setImportance] = useState<1 | 2 | 3>(existingAns?.importance || 2);
  const [dealbreaker, setDealbreaker] = useState<boolean>(Boolean(existingAns?.dealbreaker));
  const [note, setNote] = useState<string>(existingAns?.note || '');
  const [inPersonSelected, setInPersonSelected] = useState<boolean>(Boolean(existingAns?.inPerson));

  // Sync state whenever question index changes
  useEffect(() => {
    if (currentQ) {
      const ans = activeUserAnswers[currentQ.id];
      setSelectedVal(ans?.value ?? (currentQ.type === 'scale' ? 3 : currentQ.type === 'multi' ? [] : undefined));
      setImportance(ans?.importance || 2);
      setDealbreaker(Boolean(ans?.dealbreaker));
      setNote(ans?.note || '');
      setInPersonSelected(Boolean(ans?.inPerson));
    }
  }, [currentIndex, currentQ, activeUserAnswers]);

  // Topic Gate check when entering sensitive topics for the first time
  const handleNext = () => {
    // Save current answer before moving forward
    if (inPersonSelected) {
      markInPerson(currentQ.id);
    } else if (selectedVal !== undefined) {
      saveCurrentAnswer(currentQ.id, selectedVal, importance, dealbreaker, note);
    }

    if (currentIndex < activeQuestions.length - 1) {
      const nextQ = activeQuestions[currentIndex + 1];
      const nextTopic = topics.find((t) => t.id === nextQ.topicId);

      // Trigger heavy section gate if transitioning into a sensitive topic
      if (nextTopic && nextTopic.sensitive && nextTopic.id !== currentTopic?.id) {
        setGateTopicName(nextTopic.name.toUpperCase());
        setShowGate(true);
        setCurrentIndex(currentIndex + 1);
        return;
      }

      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all questions
      navigateTo('WAITING_FOR_PARTNER');
    }
  };

  const handleSkip = () => {
    skipCurrentQuestion(currentQ.id);
    if (currentIndex < activeQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      navigateTo('WAITING_FOR_PARTNER');
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (canGoBack) {
      goBack();
    }
  };

  if (showGate) {
    return (
      <HeavyGateScreen
        topicTitle={gateTopicName}
        onContinue={() => setShowGate(false)}
        onSkip={() => {
          setShowGate(false);
          // Skip remaining questions in this sensitive section
          handleSkip();
        }}
      />
    );
  }

  if (!currentQ || !currentTopic) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, getGroteskFont('600')]}>
            No topics currently selected.
          </Text>
          <PillButton
            title="Choose topics →"
            variant="primaryOnMaroon"
            onPress={() => navigateTo('CHOOSE_TOPICS')}
          />
        </View>
      </SafeAreaView>
    );
  }

  const topicQuestions = activeQuestions.filter((q) => q.topicId === currentTopic.id);
  const questionIndexInTopic = topicQuestions.findIndex((q) => q.id === currentQ.id) + 1;
  const progressRatio = (currentIndex + 1) / activeQuestions.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Header matching website Phone 1 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handlePrevious}
          style={styles.backButton}
          accessibilityLabel="Back to previous question"
        >
          <Text style={[styles.backText, getGroteskFont('500')]}>←</Text>
        </TouchableOpacity>

        <Text style={[styles.headerLabel, getGroteskFont('600')]}>
          QUESTIONNAIRE · {currentTopic.name.toUpperCase()} · {questionIndexInTopic} OF {topicQuestions.length}
        </Text>

        <TouchableOpacity onPress={handleSkip} style={styles.skipHeaderBtn}>
          <Text style={[styles.skipHeaderText, getGroteskFont('500')]}>Skip</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressWrapper}>
        <ProgressBar progress={progressRatio} height={8} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Question in Grotesk 22/600 (Section 7.2) */}
        <Text style={[styles.questionText, getGroteskFont('600')]}>
          {currentQ.text}
        </Text>

        {/* Options based on Question Type */}
        <View style={styles.optionsContainer}>
          {currentQ.type === 'scale' ? (
            <ScaleSlider
              value={Number(selectedVal) || 3}
              onChange={(val) => {
                setSelectedVal(val);
                setInPersonSelected(false);
              }}
              minLabel={currentQ.scaleLabels?.min || 'Low'}
              maxLabel={currentQ.scaleLabels?.max || 'High'}
              options={currentQ.options}
            />
          ) : currentQ.type === 'multi' ? (
            currentQ.options.map((opt) => {
              const currentArr = Array.isArray(selectedVal) ? selectedVal : [];
              const isSelected = currentArr.includes(opt) && !inPersonSelected;
              return (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={isSelected}
                  isMulti={true}
                  onPress={() => {
                    setInPersonSelected(false);
                    if (currentArr.includes(opt)) {
                      setSelectedVal(currentArr.filter((x: string) => x !== opt));
                    } else {
                      setSelectedVal([...currentArr, opt]);
                    }
                  }}
                />
              );
            })
          ) : (
            currentQ.options.map((opt) => {
              const isSelected = selectedVal === opt && !inPersonSelected;
              return (
                <OptionCard
                  key={opt}
                  label={opt}
                  selected={isSelected}
                  onPress={() => {
                    setSelectedVal(opt);
                    setInPersonSelected(false);
                  }}
                />
              );
            })
          )}

          {/* Prefer to discuss in person option (Coercion awareness, Section 5) */}
          {currentQ.allowInPerson && (
            <OptionCard
              label="Prefer to discuss in person over chai"
              selected={inPersonSelected}
              onPress={() => {
                setInPersonSelected(true);
                setSelectedVal(undefined);
              }}
            />
          )}
        </View>

        {/* Importance Selector (Low / Medium / High) */}
        <ImportanceSelector
          importance={importance}
          onChange={(lvl) => setImportance(lvl)}
        />

        {/* Dealbreaker Toggle */}
        <DealbreakerToggle
          enabled={dealbreaker}
          onToggle={() => setDealbreaker(!dealbreaker)}
        />

        {/* Collapsible Private Note with Dashed Box */}
        <PrivateNoteField
          note={note}
          onNoteChange={(txt) => setNote(txt)}
        />

        {/* Bottom Action Row: "Skip for now" (outline) and "Next" (ink fill) */}
        <View style={styles.bottomRow}>
          <View style={styles.skipCol}>
            <PillButton
              title="Skip for now"
              variant="skipOutline"
              onPress={handleSkip}
            />
          </View>
          <View style={styles.nextCol}>
            <PillButton
              title={currentIndex === activeQuestions.length - 1 ? 'Finish →' : 'Next →'}
              variant="primaryOnMaroon"
              onPress={handleNext}
            />
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backText: {
    color: PALETTE.paper,
    fontSize: 22,
  },
  headerLabel: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    textAlign: 'center',
    flex: 1,
  },
  skipHeaderBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  skipHeaderText: {
    color: PALETTE.mist,
    fontSize: 13,
  },
  progressWrapper: {
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  questionText: {
    color: PALETTE.paper,
    fontSize: 22, // Grotesk 22/600 (Section 9)
    lineHeight: 30,
    marginVertical: 12,
  },
  optionsContainer: {
    marginVertical: 8,
  },
  bottomRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
    marginBottom: 20,
  },
  skipCol: {
    flex: 1,
  },
  nextCol: {
    flex: 1.2,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    color: PALETTE.paper,
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
});
