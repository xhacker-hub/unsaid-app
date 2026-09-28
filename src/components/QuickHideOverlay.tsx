import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from 'react-native';
import { PALETTE, RADIUS } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { useApp } from '../context/AppContext';

export const QuickHideOverlay: React.FC = () => {
  const { quickHideActive, setQuickHideActive } = useApp();
  const [calcInput, setCalcInput] = useState('0');

  if (!quickHideActive) return null;

  const handleButton = (val: string) => {
    if (val === 'C') {
      setCalcInput('0');
    } else if (val === '=') {
      try {
        // Safe basic eval for simple numbers
        const clean = calcInput.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        const res = Function(`'use strict'; return (${clean})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput('0');
      }
    } else {
      setCalcInput((prev) => (prev === '0' ? val : prev + val));
    }
  };

  return (
    <SafeAreaView style={styles.overlay}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, getGroteskFont('600')]}>
          Calculator
        </Text>
        <TouchableOpacity
          onPress={() => setQuickHideActive(false)}
          style={styles.exitButton}
          accessibilityLabel="Resume Unsaid app"
        >
          <Text style={[styles.exitButtonText, getGroteskFont('500')]}>
            Exit Disguise ✕
          </Text>
        </TouchableOpacity>
      </View>

      {/* Calculator Display */}
      <View style={styles.displayArea}>
        <Text style={[styles.displayText, getGroteskFont('700')]} numberOfLines={1}>
          {calcInput}
        </Text>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {[
          ['C', '±', '%', '÷'],
          ['7', '8', '9', '×'],
          ['4', '5', '6', '-'],
          ['1', '2', '3', '+'],
          ['0', '.', '='],
        ].map((row, rIdx) => (
          <View key={rIdx} style={styles.row}>
            {row.map((btn) => (
              <TouchableOpacity
                key={btn}
                onPress={() => handleButton(btn)}
                style={[
                  styles.calcBtn,
                  btn === '0' && styles.zeroBtn,
                  ['÷', '×', '-', '+', '='].includes(btn)
                    ? styles.opBtn
                    : styles.numBtn,
                ]}
              >
                <Text
                  style={[
                    styles.btnText,
                    getGroteskFont('600'),
                    ['÷', '×', '-', '+', '='].includes(btn)
                      ? styles.opBtnText
                      : styles.numBtnText,
                  ]}
                >
                  {btn}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>

      <Text style={[styles.discreetFooter, getGroteskFont('400')]}>
        Tap 'Exit Disguise' above to return to Unsaid.
      </Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#1C1C1E',
    zIndex: 9999,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  headerTitle: {
    color: '#8E8E93',
    fontSize: 14,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  exitButton: {
    backgroundColor: '#2C2C2E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.pill,
  },
  exitButtonText: {
    color: '#E5E5EA',
    fontSize: 12,
  },
  displayArea: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  displayText: {
    color: '#FFFFFF',
    fontSize: 56,
  },
  keypad: {
    gap: 12,
    paddingBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  calcBtn: {
    flex: 1,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  zeroBtn: {
    flex: 2.15,
    alignItems: 'flex-start',
    paddingLeft: 24,
  },
  numBtn: {
    backgroundColor: '#3A3A3C',
  },
  opBtn: {
    backgroundColor: '#FF9F0A',
  },
  btnText: {
    fontSize: 24,
  },
  numBtnText: {
    color: '#FFFFFF',
  },
  opBtnText: {
    color: '#FFFFFF',
  },
  discreetFooter: {
    textAlign: 'center',
    color: '#636366',
    fontSize: 12,
  },
});
