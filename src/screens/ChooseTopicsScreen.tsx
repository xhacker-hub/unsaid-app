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
import { TopicToggle } from '../components/TopicToggle';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const ChooseTopicsScreen: React.FC = () => {
  const {
    navigateTo,
    topics,
    userConsentA,
    userConsentB,
    toggleTopicConsent,
    commonTopicIds,
    activeUser,
  } = useApp();

  const isUserA = activeUser.id === 'user_arjun';
  const consentMap = isUserA ? userConsentA : userConsentB;

  const handleStartQuestionnaire = () => {
    // If the first topic is sensitive or if user is ready, navigate to Questionnaire or Gate
    navigateTo('QUESTIONNAIRE');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        <Text style={[styles.eyebrow, getGroteskFont('600')]}>
          TOPIC CONSENT
        </Text>
        <Text style={[styles.headline, getGroteskFont('700')]}>
          Choose your topics
        </Text>

        {/* Symmetric consent banner (Section 2 & 9) */}
        <View style={styles.banner}>
          <Text style={[styles.bannerText, getGroteskFont('500')]}>
            Only topics you both choose are compared. You can add more later.
          </Text>
        </View>

        {/* Counter of common topics */}
        <View style={styles.counterBadge}>
          <Text style={[styles.counterText, getGroteskFont('600')]}>
            You’re comparing {commonTopicIds.size} topics together.
          </Text>
        </View>

        {/* Topic Toggle Cards */}
        <View style={styles.topicsList}>
          {topics.map((t) => (
            <TopicToggle
              key={t.id}
              topic={t}
              selected={Boolean(consentMap[t.id])}
              onToggle={() => toggleTopicConsent(t.id)}
            />
          ))}
        </View>

        <View style={styles.buttonWrapper}>
          <PillButton
            title="Start questionnaire →"
            variant="primaryOnMaroon"
            onPress={handleStartQuestionnaire}
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
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    marginTop: 12,
  },
  headline: {
    color: PALETTE.paper,
    fontSize: 26,
    textAlign: 'center',
    marginVertical: 6,
  },
  banner: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 14,
    marginVertical: 12,
    maxWidth: 340,
    width: '100%',
  },
  bannerText: {
    color: PALETTE.paper,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
  },
  counterBadge: {
    backgroundColor: PALETTE.wine,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
    marginBottom: 16,
  },
  counterText: {
    color: PALETTE.paper,
    fontSize: 13,
  },
  topicsList: {
    width: '100%',
    maxWidth: 340,
  },
  buttonWrapper: {
    width: '100%',
    maxWidth: 320,
    marginTop: 20,
  },
});
