import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { useApp } from '../context/AppContext';

export const AppLockModal: React.FC = () => {
  const { appLocked, unlockApp } = useApp();
  const [pin, setPin] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!appLocked) return null;

  const handleDigit = (digit: string) => {
    if (pin.length < 4) {
      const nextPin = pin + digit;
      setPin(nextPin);
      setErrorMsg('');

      if (nextPin.length === 4) {
        const ok = unlockApp(nextPin);
        if (!ok) {
          setErrorMsg('Incorrect PIN. Try 1234 for demo.');
          setPin('');
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin((prev) => prev.slice(0, -1));
    setErrorMsg('');
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.content}>
        <Text style={[styles.wordmark, getGroteskFont('700')]}>
          Unsaid
        </Text>
        <Text style={[styles.title, getGroteskFont('600')]}>
          Enter your 4-digit PIN
        </Text>
        <Text style={[styles.hint, getGroteskFont('400')]}>
          This questionnaire is just for the two of you.
        </Text>

        {/* 4 PIN Dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3].map((idx) => (
            <View
              key={idx}
              style={[
                styles.dot,
                pin.length > idx ? styles.dotFilled : styles.dotEmpty,
              ]}
            />
          ))}
        </View>

        {errorMsg ? (
          <Text style={[styles.errorText, getGroteskFont('500')]}>
            {errorMsg}
          </Text>
        ) : (
          <Text style={[styles.demoNote, getGroteskFont('400')]}>
            Demo PIN is 1234
          </Text>
        )}

        {/* Keypad */}
        <View style={styles.keypad}>
          {[
            ['1', '2', '3'],
            ['4', '5', '6'],
            ['7', '8', '9'],
            ['', '0', '⌫'],
          ].map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {row.map((btn, bIdx) => {
                if (!btn) {
                  return <View key={bIdx} style={styles.keyCell} />;
                }
                const isBack = btn === '⌫';
                return (
                  <TouchableOpacity
                    key={bIdx}
                    onPress={() => (isBack ? handleBackspace() : handleDigit(btn))}
                    style={styles.keyCell}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.keyText, getGroteskFont('600')]}>
                      {btn}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: PALETTE.ground,
    zIndex: 9998,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 320,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wordmark: {
    color: PALETTE.paper,
    fontSize: 28,
    letterSpacing: -1,
    marginBottom: 20,
  },
  title: {
    color: PALETTE.paper,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 6,
  },
  hint: {
    color: PALETTE.mist,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: PALETTE.paper,
  },
  dotFilled: {
    backgroundColor: PALETTE.paper,
  },
  dotEmpty: {
    backgroundColor: 'transparent',
  },
  errorText: {
    color: PALETTE.marigold,
    fontSize: 13,
    marginBottom: 16,
  },
  demoNote: {
    color: PALETTE.mist,
    fontSize: 12,
    marginBottom: 16,
    opacity: 0.8,
  },
  keypad: {
    width: '100%',
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  keyCell: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: PALETTE.ground2,
    borderWidth: 1,
    borderColor: PALETTE.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyText: {
    color: PALETTE.paper,
    fontSize: 24,
  },
});
