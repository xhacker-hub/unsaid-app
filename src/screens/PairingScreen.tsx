import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Share,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { TornCard } from '../components/TornCard';
import { PillButton } from '../components/PillButton';
import { Figures } from '../components/Figures';
import { useApp } from '../context/AppContext';

export const PairingScreen: React.FC = () => {
  const {
    navigateTo,
    pairInviteCode,
    activeUser,
    partnerUser,
    partnerJoined,
    setPartnerJoined,
    confirmPair,
  } = useApp();

  const [mode, setMode] = useState<'create' | 'enter' | 'confirm'>('create');
  const [inputCode, setInputCode] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleShareWhatsApp = async () => {
    try {
      await Share.share({
        message: `I've started our private questionnaire on Unsaid so we can talk about the things that matter over our next chai. Use invite code: ${pairInviteCode}`,
      });
    } catch {
      // Fallback
    }
  };

  const handleCopyCode = () => {
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  const handleJoinWithCode = () => {
    if (inputCode.trim().length >= 4) {
      setPartnerJoined(true);
      setMode('confirm');
    }
  };

  const handleProceedToTopics = () => {
    confirmPair();
    navigateTo('CHOOSE_TOPICS');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Wordmark size="small" />

        {mode === 'create' && (
          <>
            <Text style={[styles.eyebrow, getGroteskFont('600')]}>
              PAIR WITH YOUR PARTNER
            </Text>
            <Text style={[styles.headline, getGroteskFont('700')]}>
              Connect privately
            </Text>
            <Text style={[styles.subcopy, getGroteskFont('400')]}>
              Send this 6-character invite code to the person you are getting to know.
              Unsaid pairs you 1:1.
            </Text>

            {/* Big 6-character code on torn cream card (Section 9) */}
            <View style={styles.cardWrapper}>
              <TornCard variant="cream" tilt="slight">
                <Text style={[styles.codeLabel, getGroteskFont('600')]}>
                  YOUR INVITATION CODE
                </Text>
                <Text style={[styles.codeText, getGroteskFont('700')]}>
                  {pairInviteCode}
                </Text>
                <Text style={[styles.codeValidity, getGroteskFont('400')]}>
                  Expires in 48 hours · Private 1:1 pair
                </Text>
              </TornCard>
            </View>

            {/* Sharing Actions */}
            <View style={styles.buttonStack}>
              <PillButton
                title="Share on WhatsApp →"
                variant="primaryOnMaroon"
                onPress={handleShareWhatsApp}
              />

              <PillButton
                title={copySuccess ? '✓ Code copied' : 'Copy invite code'}
                variant="secondaryOutline"
                onPress={handleCopyCode}
              />
            </View>

            {/* Waiting or switch to enter code */}
            <View style={styles.waitingContainer}>
              <Figures expression="shy" size="small" />
              <Text style={[styles.waitingNotice, getGroteskFont('500')]}>
                Waiting for them to join...
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setMode('confirm')}
              style={styles.simulateJoinBtn}
            >
              <Text style={[styles.simulateJoinText, getGroteskFont('600')]}>
                ⚡ Simulate Partner Joined ({partnerUser.displayName})
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setMode('enter')}
              style={styles.switchModeLink}
            >
              <Text style={[styles.switchModeText, getGroteskFont('500')]}>
                Have a code from them? Enter it here →
              </Text>
            </TouchableOpacity>
          </>
        )}

        {mode === 'enter' && (
          <View style={styles.enterContainer}>
            <Text style={[styles.eyebrow, getGroteskFont('600')]}>
              ENTER INVITE CODE
            </Text>
            <Text style={[styles.headline, getGroteskFont('700')]}>
              Got a code from them?
            </Text>
            <Text style={[styles.subcopy, getGroteskFont('400')]}>
              Type the 6-character code they shared with you.
            </Text>

            <TextInput
              value={inputCode}
              onChangeText={(t) => setInputCode(t.toUpperCase())}
              placeholder="e.g. CHAI42"
              placeholderTextColor={PALETTE.mist}
              maxLength={8}
              autoCapitalize="characters"
              style={[styles.inputBox, getGroteskFont('700')]}
            />

            <View style={styles.buttonStack}>
              <PillButton
                title="Pair with partner →"
                variant="primaryOnMaroon"
                onPress={handleJoinWithCode}
              />

              <TouchableOpacity
                onPress={() => setMode('create')}
                style={styles.switchModeLink}
              >
                <Text style={[styles.switchModeText, getGroteskFont('500')]}>
                  ← Back to my invite code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {mode === 'confirm' && (
          <View style={styles.confirmContainer}>
            <Text style={[styles.eyebrow, getGroteskFont('600')]}>
              CONFIRM YOUR PAIR
            </Text>
            <Text style={[styles.headline, getGroteskFont('700')]}>
              Is this the person you’re getting to know?
            </Text>

            <View style={styles.confirmCard}>
              <View style={styles.pairRow}>
                <View style={styles.partnerBubble}>
                  <Text style={[styles.partnerInitial, getGroteskFont('700')]}>
                    {activeUser.displayName.charAt(0)}
                  </Text>
                  <Text style={[styles.partnerName, getGroteskFont('600')]}>
                    {activeUser.displayName} (You)
                  </Text>
                </View>

                <Text style={[styles.pairingAmpersand, getGroteskFont('700')]}>
                  &
                </Text>

                <View style={styles.partnerBubble}>
                  <Text style={[styles.partnerInitial, getGroteskFont('700')]}>
                    {partnerUser.displayName.charAt(0)}
                  </Text>
                  <Text style={[styles.partnerName, getGroteskFont('600')]}>
                    {partnerUser.displayName}
                  </Text>
                </View>
              </View>

              <Text style={[styles.confirmNote, getGroteskFont('400')]}>
                Neither of you can see each other's answers until both finish the questionnaire.
                Either of you can unpair at any time.
              </Text>
            </View>

            <View style={styles.buttonStack}>
              <PillButton
                title="Yes, this is us →"
                variant="primaryOnMaroon"
                onPress={handleProceedToTopics}
              />
            </View>
          </View>
        )}
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
  subcopy: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    maxWidth: 320,
    marginBottom: 16,
  },
  cardWrapper: {
    width: '100%',
    maxWidth: 320,
  },
  codeLabel: {
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    color: PALETTE.amberText,
    textAlign: 'center',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 48,
    color: PALETTE.ink,
    textAlign: 'center',
    letterSpacing: 6,
    marginVertical: 6,
  },
  codeValidity: {
    fontSize: 12,
    color: PALETTE.ink,
    textAlign: 'center',
    opacity: 0.7,
  },
  buttonStack: {
    width: '100%',
    maxWidth: 320,
    gap: 12,
    marginVertical: 14,
  },
  waitingContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  waitingNotice: {
    color: PALETTE.mist,
    fontSize: 14,
    marginTop: 8,
  },
  simulateJoinBtn: {
    backgroundColor: PALETTE.ground2,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.marigold,
    marginVertical: 10,
  },
  simulateJoinText: {
    color: PALETTE.marigold,
    fontSize: 12,
  },
  switchModeLink: {
    paddingVertical: 10,
  },
  switchModeText: {
    color: PALETTE.paper,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  enterContainer: {
    width: '100%',
    alignItems: 'center',
  },
  inputBox: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.input,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    paddingVertical: 16,
    textAlign: 'center',
    color: PALETTE.marigold,
    fontSize: 32,
    letterSpacing: 4,
    marginVertical: 16,
  },
  confirmContainer: {
    width: '100%',
    alignItems: 'center',
  },
  confirmCard: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 20,
    marginVertical: 16,
  },
  pairRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  partnerBubble: {
    alignItems: 'center',
  },
  partnerInitial: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PALETTE.paper,
    color: PALETTE.ink,
    fontSize: 24,
    textAlign: 'center',
    lineHeight: 56,
    marginBottom: 8,
  },
  partnerName: {
    color: PALETTE.paper,
    fontSize: 15,
  },
  pairingAmpersand: {
    color: PALETTE.marigold,
    fontSize: 28,
  },
  confirmNote: {
    color: PALETTE.mist,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: PALETTE.line,
  },
});
