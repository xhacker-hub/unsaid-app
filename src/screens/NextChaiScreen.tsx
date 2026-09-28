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
import { TornCard } from '../components/TornCard';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const NextChaiScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    nextChaiItems,
    markTalked,
    setQuickHideActive,
  } = useApp();

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
          DISCREET MEETING VIEW
        </Text>

        <TouchableOpacity
          onPress={() => setQuickHideActive(true)}
          style={styles.hideBtn}
          accessibilityLabel="Quick hide screen"
        >
          <Text style={styles.hideBtnText}>🛡️ Hide</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        <View style={styles.titleRow}>
          <Text style={styles.chaiCupIcon}>☕</Text>
          <View>
            <Text style={[styles.title, getGroteskFont('700')]}>
              Next Chai
            </Text>
            <Text style={[styles.subtitle, getGroteskFont('500')]}>
              Your short list for your next meeting
            </Text>
          </View>
        </View>

        <Text style={[styles.privacyNotice, getGroteskFont('400')]}>
          Large, high-contrast text designed to be easily readable with a quick glance under the table.
        </Text>

        {nextChaiItems.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={[styles.emptyTitle, getGroteskFont('600')]}>
              No questions saved yet
            </Text>
            <Text style={[styles.emptyDesc, getGroteskFont('400')]}>
              Browse through your compatibility chart to save up to 3 questions you want to bring up.
            </Text>
            <PillButton
              title="Browse suggested questions →"
              variant="primaryOnMaroon"
              onPress={() => navigateTo('ASK_WHAT_MATTERS')}
            />
          </View>
        ) : (
          <View style={styles.cardsList}>
            {nextChaiItems.slice(0, 3).map((item, idx) => {
              const tilt = idx === 0 ? 'left' : idx === 1 ? 'right' : 'slight';

              return (
                <TornCard key={item.questionId} variant="cream" tilt={tilt}>
                  <View style={styles.itemHeader}>
                    <Text style={[styles.itemNumber, getGroteskFont('700')]}>
                      #{idx + 1}
                    </Text>
                    {item.dealbreakerConflict && (
                      <Text style={[styles.itemDealbreaker, getGroteskFont('700')]}>
                        🚩 Top priority
                      </Text>
                    )}
                  </View>

                  {/* Large, high-contrast readable type (Section 9) */}
                  <Text style={[styles.itemText, getGroteskFont('600')]}>
                    "{item.suggestedText}"
                  </Text>

                  <View style={styles.tipBox}>
                    <Text style={[styles.tipText, getGroteskFont('400')]}>
                      💡 {item.tip}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => markTalked(item.questionId)}
                    style={styles.talkedBtn}
                  >
                    <Text style={[styles.talkedBtnText, getGroteskFont('600')]}>
                      ✓ We talked about this
                    </Text>
                  </TouchableOpacity>
                </TornCard>
              );
            })}
          </View>
        )}

        <View style={styles.actions}>
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
  hideBtn: {
    backgroundColor: PALETTE.ground2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  hideBtnText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 12,
  },
  chaiCupIcon: {
    fontSize: 32,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 30,
  },
  subtitle: {
    color: PALETTE.marigold,
    fontSize: 14,
  },
  privacyNotice: {
    color: PALETTE.mist,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  cardsList: {
    gap: 14,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemNumber: {
    fontSize: 18,
    color: PALETTE.amberText,
  },
  itemDealbreaker: {
    fontSize: 12,
    color: PALETTE.wine,
  },
  itemText: {
    color: PALETTE.ink,
    fontSize: 21, // Large, readable discreet font
    lineHeight: 28,
    marginBottom: 12,
  },
  tipBox: {
    backgroundColor: PALETTE.paper,
    borderRadius: RADIUS.paper,
    padding: 10,
    marginBottom: 12,
  },
  tipText: {
    color: PALETTE.ink,
    fontSize: 13,
    lineHeight: 18,
  },
  talkedBtn: {
    borderTopWidth: 1,
    borderTopColor: '#EAD9C4',
    paddingTop: 10,
    alignItems: 'center',
  },
  talkedBtnText: {
    color: PALETTE.amberText,
    fontSize: 13,
  },
  emptyCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    padding: 24,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    alignItems: 'center',
    marginVertical: 20,
  },
  emptyTitle: {
    color: PALETTE.paper,
    fontSize: 18,
    marginBottom: 8,
  },
  emptyDesc: {
    color: PALETTE.mist,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
  },
  actions: {
    marginTop: 24,
  },
});
