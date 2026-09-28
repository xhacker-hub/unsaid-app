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

export const PrivacyPromisesScreen: React.FC = () => {
  const { navigateTo } = useApp();

  const rules = [
    {
      title: 'No profiles. No matching.',
      body: 'Unsaid is not a matrimony site. There is no browsing, no public photos, and no algorithms evaluating you.',
    },
    {
      title: 'Nothing your families can see.',
      body: 'Families never get an account, link, or report. What you answer stays strictly between the two of you.',
    },
    {
      title: 'You decide what you’re ready for.',
      body: 'Sensitive topics require mutual consent. Nobody is forced into conversations before they feel safe.',
    },
    {
      title: 'Skipping never reads as a no.',
      body: 'If you skip a question, it simply shows as "not answered yet". It never counts against your alignment.',
    },
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        <Text style={[styles.eyebrow, getGroteskFont('600')]}>
          OUR PRIVACY PROMISES
        </Text>
        <Text style={[styles.headline, getGroteskFont('700')]}>
          Built for quiet honesty.
        </Text>

        <View style={styles.rulesList}>
          {rules.map((rule, idx) => (
            <View key={idx} style={styles.ruleCard}>
              <View style={styles.ruleDot} />
              <View style={styles.ruleText}>
                <Text style={[styles.ruleTitle, getGroteskFont('600')]}>
                  {rule.title}
                </Text>
                <Text style={[styles.ruleBody, getGroteskFont('400')]}>
                  {rule.body}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.buttonWrapper}>
          <PillButton
            title="I understand →"
            variant="primaryOnMaroon"
            onPress={() => navigateTo('SIGN_UP')}
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    alignItems: 'center',
  },
  eyebrow: {
    color: PALETTE.mist,
    fontSize: 12,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    marginTop: 12,
  },
  headline: {
    color: PALETTE.paper,
    fontSize: 28,
    textAlign: 'center',
    marginVertical: 8,
  },
  rulesList: {
    width: '100%',
    maxWidth: 340,
    marginVertical: 16,
    gap: 12,
  },
  ruleCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: PALETTE.rose,
    marginTop: 6,
    marginRight: 12,
  },
  ruleText: {
    flex: 1,
  },
  ruleTitle: {
    color: PALETTE.paper,
    fontSize: 16,
    marginBottom: 4,
  },
  ruleBody: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 320,
    marginTop: 16,
  },
});
