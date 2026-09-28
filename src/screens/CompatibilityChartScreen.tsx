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
import { Wordmark } from '../components/Wordmark';
import { ChartBar } from '../components/ChartBar';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const CompatibilityChartScreen: React.FC = () => {
  const {
    navigateTo,
    chartResults,
    topics,
    setSelectedTopicForDetail,
    nextChaiItems,
  } = useApp();

  const handleSelectTopic = (topicId: string) => {
    setSelectedTopicForDetail(topicId);
    navigateTo('TOPIC_DETAIL');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Header with Wordmark & Next Chai shortcut */}
        <View style={styles.topBar}>
          <Wordmark size="small" />

          {/* Next Chai Shortcut Pill */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigateTo('NEXT_CHAI')}
            style={styles.nextChaiPill}
            accessibilityLabel={`Next chai list with ${nextChaiItems.length} questions`}
          >
            <Text style={[styles.nextChaiPillText, getGroteskFont('600')]}>
              ☕ Next Chai ({nextChaiItems.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Title matching website Phone 4 (Section 9) */}
        <Text style={[styles.title, getGroteskFont('700')]}>
          Where you match
        </Text>

        <Text style={[styles.subtitle, getGroteskFont('400')]}>
          Ordered by where you differ most. Tap any topic to see question-by-question comparison.
        </Text>

        {/* Topic Rows sorted: Talk about this -> Some gaps -> Strong match -> Not answered yet */}
        <View style={styles.chartList}>
          {chartResults.map((result) => {
            const topic = topics.find((t) => t.id === result.topicId);
            if (!topic) return null;

            return (
              <ChartBar
                key={topic.id}
                topic={topic}
                result={result}
                onPress={() => handleSelectTopic(topic.id)}
              />
            );
          })}
        </View>

        {/* Primary CTA: "See what to ask" */}
        <View style={styles.actions}>
          <PillButton
            title="See what to ask →"
            variant="primaryOnMaroon"
            onPress={() => navigateTo('ASK_WHAT_MATTERS')}
          />
        </View>

        {/* Settings and Discreet Links */}
        <View style={styles.footerLinks}>
          <TouchableOpacity
            onPress={() => navigateTo('SETTINGS')}
            style={styles.settingsLink}
          >
            <Text style={[styles.settingsLinkText, getGroteskFont('500')]}>
              ⚙️ Privacy & Settings
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
    paddingTop: 12,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nextChaiPill: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.pill,
    borderWidth: 1.5,
    borderColor: PALETTE.marigold,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  nextChaiPillText: {
    color: PALETTE.marigold,
    fontSize: 13,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 32, // Matches website Phone 4
    marginTop: 6,
    marginBottom: 6,
  },
  subtitle: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  chartList: {
    width: '100%',
    marginBottom: 20,
  },
  actions: {
    width: '100%',
    marginTop: 8,
    marginBottom: 16,
  },
  footerLinks: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingsLink: {
    padding: 8,
  },
  settingsLinkText: {
    color: PALETTE.mist,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});
