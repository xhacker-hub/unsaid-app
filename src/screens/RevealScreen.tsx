import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { PALETTE } from '../theme/tokens';
import { BumblebeeReveal } from '../components/BumblebeeReveal';
import { useApp } from '../context/AppContext';

export const RevealScreen: React.FC = () => {
  const { navigateTo, setRevealSeen } = useApp();

  const handleRevealComplete = () => {
    setRevealSeen(true);
    navigateTo('COMPATIBILITY_CHART');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <BumblebeeReveal onComplete={handleRevealComplete} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PALETTE.ground,
  },
  container: {
    flex: 1,
    position: 'relative',
  },
});
