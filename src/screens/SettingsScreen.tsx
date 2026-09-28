import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const SettingsScreen: React.FC = () => {
  const {
    goBack,
    navigateTo,
    activeUser,
    partnerUser,
    unpair,
    deleteEverything,
    lockApp,
    reducedMotion,
    setReducedMotion,
    discreetNotifications,
    setDiscreetNotifications,
    setQuickHideActive,
    switchActiveUser,
  } = useApp();

  const [language, setLanguage] = useState<'en' | 'hi' | 'hinglish'>('en');
  const [unpairedNotice, setUnpairedNotice] = useState(false);

  const handleUnpair = () => {
    unpair();
    setUnpairedNotice(true);
  };

  const handleDeleteEverything = () => {
    deleteEverything();
    navigateTo('WELCOME');
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
          SAFETY & SETTINGS
        </Text>

        <View style={styles.placeholder} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        <Text style={[styles.title, getGroteskFont('700')]}>
          Privacy & Controls
        </Text>

        {/* 1. Partner & Active Identity info */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, getGroteskFont('600')]}>
            ACTIVE PAIR
          </Text>
          <Text style={[styles.pairInfo, getGroteskFont('400')]}>
            You: <Text style={styles.boldText}>{activeUser.displayName}</Text> ({activeUser.phone})
          </Text>
          <Text style={[styles.pairInfo, getGroteskFont('400')]}>
            Partner: <Text style={styles.boldText}>{partnerUser.displayName}</Text>
          </Text>
          <TouchableOpacity
            onPress={switchActiveUser}
            style={styles.switchPartnerLink}
          >
            <Text style={[styles.switchPartnerText, getGroteskFont('600')]}>
              🔄 Switch view to {partnerUser.displayName} (Demo toggle)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Security & Discreet Controls */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, getGroteskFont('600')]}>
            DISCREET CONTROLS
          </Text>

          {/* App Lock PIN */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, getGroteskFont('600')]}>
                App PIN Lock
              </Text>
              <Text style={[styles.rowDesc, getGroteskFont('400')]}>
                Require 4-digit PIN (1234) upon opening
              </Text>
            </View>
            <TouchableOpacity
              onPress={lockApp}
              style={styles.lockNowBtn}
            >
              <Text style={[styles.lockNowText, getGroteskFont('600')]}>Lock Now</Text>
            </TouchableOpacity>
          </View>

          {/* Discreet Notifications */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, getGroteskFont('600')]}>
                Discreet Notifications
              </Text>
              <Text style={[styles.rowDesc, getGroteskFont('400')]}>
                Shows "Update in Unsaid" with zero question details
              </Text>
            </View>
            <Switch
              value={discreetNotifications}
              onValueChange={setDiscreetNotifications}
              trackColor={{ false: PALETTE.line, true: PALETTE.wine }}
              thumbColor={PALETTE.paper}
            />
          </View>

          {/* Quick Hide Trigger */}
          <View style={styles.row}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, getGroteskFont('600')]}>
                Quick Hide Disguise
              </Text>
              <Text style={[styles.rowDesc, getGroteskFont('400')]}>
                Tap the wordmark anytime to show calculator
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => setQuickHideActive(true)}
              style={styles.testBtn}
            >
              <Text style={[styles.testBtnText, getGroteskFont('600')]}>Test</Text>
            </TouchableOpacity>
          </View>

          {/* Reduced Motion Toggle */}
          <View style={[styles.row, styles.noBorderRow]}>
            <View style={styles.rowText}>
              <Text style={[styles.rowTitle, getGroteskFont('600')]}>
                Reduced Motion
              </Text>
              <Text style={[styles.rowDesc, getGroteskFont('400')]}>
                Static sentences, cross-fade reveal
              </Text>
            </View>
            <Switch
              value={reducedMotion}
              onValueChange={setReducedMotion}
              trackColor={{ false: PALETTE.line, true: PALETTE.wine }}
              thumbColor={PALETTE.paper}
            />
          </View>
        </View>

        {/* 3. Language Selector */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, getGroteskFont('600')]}>
            LANGUAGE
          </Text>
          <View style={styles.langRow}>
            {[
              { id: 'en', label: 'English' },
              { id: 'hi', label: 'हिन्दी' },
              { id: 'hinglish', label: 'Hinglish' },
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setLanguage(item.id as any)}
                style={[
                  styles.langPill,
                  language === item.id && styles.langPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.langText,
                    getGroteskFont('500'),
                    language === item.id && styles.langTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 4. Mental Health & Helplines (Section 5) */}
        <View style={styles.sectionCard}>
          <Text style={[styles.sectionTitle, getGroteskFont('600')]}>
            SUPPORT & HELPLINES (INDIA)
          </Text>

          <View style={styles.helplineItem}>
            <Text style={[styles.helplineName, getGroteskFont('600')]}>
              Tele-MANAS National Helpline
            </Text>
            <Text style={[styles.helplineNumber, getGroteskFont('700')]}>
              Dial: 14416 / 1800 891 4416
            </Text>
            <Text style={[styles.helplineDesc, getGroteskFont('400')]}>
              Free, 24/7 confidential mental-health counseling by Govt of India.
            </Text>
          </View>

          <View style={styles.helplineItem}>
            <Text style={[styles.helplineName, getGroteskFont('600')]}>
              KIRAN Mental Health Line
            </Text>
            <Text style={[styles.helplineNumber, getGroteskFont('700')]}>
              Dial: 1800-599-0019
            </Text>
          </View>

          <TouchableOpacity
            style={styles.counsellorPlaceholder}
            onPress={() => Alert.alert('Coming Soon', 'Partnership with verified couples counsellors.')}
          >
            <Text style={[styles.counsellorText, getGroteskFont('600')]}>
              🤝 Talk to a Pre-Marital Counsellor (Coming Soon)
            </Text>
          </TouchableOpacity>
        </View>

        {/* 5. Danger Zone: Unpair & Delete Everything (Section 5) */}
        <View style={[styles.sectionCard, styles.dangerCard]}>
          <Text style={[styles.dangerTitle, getGroteskFont('600')]}>
            LEAVING & DATA ERASURE
          </Text>
          <Text style={[styles.dangerDesc, getGroteskFont('400')]}>
            Unpairing immediately wipes the shared chart for both. Neither will see scores anymore.
          </Text>

          {unpairedNotice ? (
            <View style={styles.unpairedNoticeBox}>
              <Text style={[styles.unpairedNoticeText, getGroteskFont('600')]}>
                Your pair has ended.
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={handleUnpair}
              style={styles.unpairBtn}
            >
              <Text style={[styles.unpairBtnText, getGroteskFont('600')]}>
                Unpair from {partnerUser.displayName}
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            onPress={handleDeleteEverything}
            style={styles.deleteBtn}
          >
            <Text style={[styles.deleteBtnText, getGroteskFont('600')]}>
              Delete everything and reset
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
    marginBottom: 16,
  },
  sectionCard: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 16,
    marginBottom: 14,
  },
  sectionTitle: {
    color: PALETTE.marigold,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  pairInfo: {
    color: PALETTE.paper,
    fontSize: 14,
    marginBottom: 4,
  },
  boldText: {
    fontWeight: 'bold',
  },
  switchPartnerLink: {
    marginTop: 8,
    paddingVertical: 6,
  },
  switchPartnerText: {
    color: PALETTE.marigold,
    fontSize: 13,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.line,
  },
  noBorderRow: {
    borderBottomWidth: 0,
    paddingBottom: 4,
  },
  rowText: {
    flex: 1,
    marginRight: 10,
  },
  rowTitle: {
    color: PALETTE.paper,
    fontSize: 15,
  },
  rowDesc: {
    color: PALETTE.mist,
    fontSize: 12,
    marginTop: 2,
  },
  lockNowBtn: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PALETTE.paper,
  },
  lockNowText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  testBtn: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  testBtnText: {
    color: PALETTE.paper,
    fontSize: 12,
  },
  langRow: {
    flexDirection: 'row',
    gap: 8,
  },
  langPill: {
    flex: 1,
    borderRadius: RADIUS.pill,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.line,
    backgroundColor: PALETTE.ground,
  },
  langPillActive: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  langText: {
    color: PALETTE.paper,
    fontSize: 13,
  },
  langTextActive: {
    color: PALETTE.ink,
    fontWeight: 'bold',
  },
  helplineItem: {
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.line,
    paddingBottom: 10,
    marginBottom: 10,
  },
  helplineName: {
    color: PALETTE.paper,
    fontSize: 14,
  },
  helplineNumber: {
    color: PALETTE.marigold,
    fontSize: 14,
    marginVertical: 2,
  },
  helplineDesc: {
    color: PALETTE.mist,
    fontSize: 12,
    lineHeight: 16,
  },
  counsellorPlaceholder: {
    backgroundColor: PALETTE.ground,
    padding: 12,
    borderRadius: RADIUS.paper,
    alignItems: 'center',
    marginTop: 6,
  },
  counsellorText: {
    color: PALETTE.paper,
    fontSize: 13,
  },
  dangerCard: {
    borderColor: PALETTE.rose,
  },
  dangerTitle: {
    color: PALETTE.rose,
    fontSize: 11,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  dangerDesc: {
    color: PALETTE.mist,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 14,
  },
  unpairBtn: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.pill,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: PALETTE.rose,
    marginBottom: 10,
  },
  unpairBtnText: {
    color: PALETTE.rose,
    fontSize: 14,
  },
  deleteBtn: {
    paddingVertical: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: PALETTE.mist,
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  unpairedNoticeBox: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.card,
    padding: 12,
    alignItems: 'center',
  },
  unpairedNoticeText: {
    color: PALETTE.paper,
    fontSize: 14,
  },
});
