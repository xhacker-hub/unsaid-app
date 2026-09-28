import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Wordmark } from '../components/Wordmark';
import { PillButton } from '../components/PillButton';
import { useApp } from '../context/AppContext';

export const SignUpScreen: React.FC = () => {
  const { navigateTo, setUserName, activeUser } = useApp();

  const [step, setStep] = useState<'phone' | 'otp' | 'profile'>('phone');
  const [phone, setPhone] = useState(activeUser.phone || '9876543210');
  const [otp, setOtp] = useState('');
  const [displayName, setDisplayName] = useState(activeUser.displayName || 'Arjun');
  const [ageConfirmed, setAgeConfirmed] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSendOtp = () => {
    if (phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMessage('');
    setStep('otp');
  };

  const handleVerifyOtp = () => {
    // In demo prototype, auto-accept any 4 digits or default to 1234
    if (otp.length < 4 && otp !== '1234') {
      setErrorMessage('Please enter the 4-digit verification code.');
      return;
    }
    setErrorMessage('');
    setStep('profile');
  };

  const handleCompleteSignUp = () => {
    if (!displayName.trim()) {
      setErrorMessage('Please provide a name or nickname.');
      return;
    }
    if (!ageConfirmed) {
      setErrorMessage('You must confirm that you are 18 or older.');
      return;
    }
    setUserName(displayName.trim());
    navigateTo('PAIRING');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Wordmark size="small" />

        <View style={styles.cardContainer}>
          {step === 'phone' && (
            <>
              <Text style={[styles.eyebrow, getGroteskFont('600')]}>
                STEP 1 OF 3
              </Text>
              <Text style={[styles.title, getGroteskFont('700')]}>
                Your mobile number
              </Text>
              <Text style={[styles.subcopy, getGroteskFont('400')]}>
                We will send a quick verification code. We never spam or show your number to parents.
              </Text>

              <View style={styles.phoneInputRow}>
                <View style={styles.countryCode}>
                  <Text style={[styles.countryCodeText, getGroteskFont('600')]}>
                    🇮🇳 +91
                  </Text>
                </View>
                <TextInput
                  value={phone}
                  onChangeText={(t) => {
                    setPhone(t.replace(/[^0-9]/g, ''));
                    setErrorMessage('');
                  }}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  placeholderTextColor={PALETTE.mist}
                  maxLength={10}
                  style={[styles.input, getGroteskFont('600')]}
                />
              </View>

              {errorMessage ? (
                <Text style={[styles.errorText, getGroteskFont('500')]}>
                  {errorMessage}
                </Text>
              ) : null}

              <View style={styles.actionBtn}>
                <PillButton
                  title="Send verification code →"
                  variant="primaryOnMaroon"
                  onPress={handleSendOtp}
                />
              </View>
            </>
          )}

          {step === 'otp' && (
            <>
              <Text style={[styles.eyebrow, getGroteskFont('600')]}>
                STEP 2 OF 3
              </Text>
              <Text style={[styles.title, getGroteskFont('700')]}>
                Enter the 4-digit code
              </Text>
              <Text style={[styles.subcopy, getGroteskFont('400')]}>
                Sent to +91 {phone}. Demo code is 1234.
              </Text>

              <TextInput
                value={otp}
                onChangeText={(t) => {
                  setOtp(t);
                  setErrorMessage('');
                }}
                keyboardType="number-pad"
                placeholder="1234"
                placeholderTextColor={PALETTE.mist}
                maxLength={4}
                style={[styles.otpInput, getGroteskFont('700')]}
              />

              {errorMessage ? (
                <Text style={[styles.errorText, getGroteskFont('500')]}>
                  {errorMessage}
                </Text>
              ) : null}

              <View style={styles.actionBtn}>
                <PillButton
                  title="Verify code →"
                  variant="primaryOnMaroon"
                  onPress={handleVerifyOtp}
                />
              </View>

              <TouchableOpacity
                onPress={() => setStep('phone')}
                style={styles.backLink}
              >
                <Text style={[styles.backLinkText, getGroteskFont('500')]}>
                  ← Change phone number
                </Text>
              </TouchableOpacity>
            </>
          )}

          {step === 'profile' && (
            <>
              <Text style={[styles.eyebrow, getGroteskFont('600')]}>
                STEP 3 OF 3
              </Text>
              <Text style={[styles.title, getGroteskFont('700')]}>
                What should your partner call you?
              </Text>
              <Text style={[styles.subcopy, getGroteskFont('400')]}>
                A first name or nickname is plenty. No photo or surname needed.
              </Text>

              <TextInput
                value={displayName}
                onChangeText={(t) => {
                  setDisplayName(t);
                  setErrorMessage('');
                }}
                placeholder="e.g. Arjun"
                placeholderTextColor={PALETTE.mist}
                style={[styles.input, getGroteskFont('600')]}
              />

              {/* 18+ Checkbox Confirmation */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setAgeConfirmed(!ageConfirmed)}
                style={styles.checkboxRow}
              >
                <View style={[styles.checkbox, ageConfirmed && styles.checkboxActive]}>
                  {ageConfirmed && <Text style={styles.checkboxMark}>✓</Text>}
                </View>
                <Text style={[styles.checkboxLabel, getGroteskFont('500')]}>
                  I confirm that I am 18 years of age or older.
                </Text>
              </TouchableOpacity>

              {errorMessage ? (
                <Text style={[styles.errorText, getGroteskFont('500')]}>
                  {errorMessage}
                </Text>
              ) : null}

              <View style={styles.actionBtn}>
                <PillButton
                  title="Continue to pairing →"
                  variant="primaryOnMaroon"
                  onPress={handleCompleteSignUp}
                />
              </View>
            </>
          )}
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
  cardContainer: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    padding: 20,
    marginTop: 20,
  },
  eyebrow: {
    color: PALETTE.mist,
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    marginBottom: 6,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 22,
    marginBottom: 6,
  },
  subcopy: {
    color: PALETTE.mist,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
  },
  phoneInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  countryCode: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.input,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    paddingHorizontal: 12,
    paddingVertical: 14,
    justifyContent: 'center',
  },
  countryCodeText: {
    color: PALETTE.paper,
    fontSize: 16,
  },
  input: {
    flex: 1,
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.input,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: PALETTE.paper,
    fontSize: 16,
  },
  otpInput: {
    backgroundColor: PALETTE.ground,
    borderRadius: RADIUS.input,
    borderWidth: 1.5,
    borderColor: PALETTE.line,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: PALETTE.marigold,
    fontSize: 24,
    letterSpacing: 8,
    textAlign: 'center',
    marginBottom: 16,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: PALETTE.mist,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkboxActive: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  checkboxMark: {
    color: PALETTE.ink,
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkboxLabel: {
    color: PALETTE.paper,
    fontSize: 13,
    flex: 1,
  },
  errorText: {
    color: PALETTE.marigold,
    fontSize: 13,
    marginBottom: 12,
  },
  actionBtn: {
    marginTop: 8,
  },
  backLink: {
    alignSelf: 'center',
    marginTop: 16,
    paddingVertical: 6,
  },
  backLinkText: {
    color: PALETTE.mist,
    fontSize: 13,
  },
});
