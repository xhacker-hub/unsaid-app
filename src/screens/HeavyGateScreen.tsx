import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

interface HeavyGateScreenProps {
  topicTitle?: string;
  onContinue?: () => void;
  onSkip?: () => void;
}

export const HeavyGateScreen: React.FC<HeavyGateScreenProps> = ({
  topicTitle = 'MENTAL HEALTH & THE PAST',
  onContinue,
  onSkip,
}) => {
  const { navigateTo } = useApp();

  const handleContinue = () => {
    if (onContinue) {
      onContinue();
    } else {
      navigateTo('QUESTIONNAIRE');
    }
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
    } else {
      navigateTo('WAITING_FOR_PARTNER');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Wordmark size="small" />

        {/* Content Box matching website Phone 3 */}
        <View style={styles.gateCard}>
          <Text style={[styles.eyebrow, getGroteskFont('600')]}>
            {topicTitle}
          </Text>

          <Text style={[styles.title, getGroteskFont('700')]}>
            This section is heavier.
          </Text>

          <Text style={[styles.body, getGroteskFont('400')]}>
            Answer only what you’re ready to. You can come back to it later.
          </Text>

          <View style={styles.buttonsStack}>
            <PillButton
              title="Continue →"
              variant="primaryOnMaroon"
              onPress={handleContinue}
            />

            <PillButton
              title="Skip for now"
              variant="skipOutline"
              onPress={handleSkip}
            />
          </View>

          {/* Footnote (Section 9) */}
          <Text style={[styles.footnote, getGroteskFont('400')]}>
            Skipped questions show as "not answered yet", never as a no.
          </Text>
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
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gateCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 24,
    alignItems: 'center',
  },
  eyebrow: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    textTransform: 'uppercase',
    marginBottom: 10,
    textAlign: 'center',
  },
  title: {
    color: PALETTE.paper,
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 12,
  },
  body: {
    color: PALETTE.mist,
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 28,
  },
  buttonsStack: {
    width: '100%',
    gap: 12,
    marginBottom: 20,
  },
  footnote: {
    color: PALETTE.mist,
    fontSize: 12,
    textAlign: 'center',
    opacity: 0.75,
  },
});
