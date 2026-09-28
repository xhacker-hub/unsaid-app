import React from 'react';
import { StyleSheet, View, SafeAreaView, StatusBar, Platform } from 'react-native';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { AppProvider, useApp } from './src/context/AppContext';
import { useAppFonts } from './src/theme/fonts';
import { PALETTE } from './src/theme/tokens';
import { DemoControlBar } from './src/components/DemoControlBar';
import { QuickHideOverlay } from './src/components/QuickHideOverlay';
import { AppLockModal } from './src/components/AppLockModal';

// Screens
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { HowItWorksScreen } from './src/screens/HowItWorksScreen';
import { PrivacyPromisesScreen } from './src/screens/PrivacyPromisesScreen';
import { SignUpScreen } from './src/screens/SignUpScreen';
import { PairingScreen } from './src/screens/PairingScreen';
import { ChooseTopicsScreen } from './src/screens/ChooseTopicsScreen';
import { HeavyGateScreen } from './src/screens/HeavyGateScreen';
import { QuestionnaireScreen } from './src/screens/QuestionnaireScreen';
import { WaitingScreen } from './src/screens/WaitingScreen';
import { RevealScreen } from './src/screens/RevealScreen';
import { CompatibilityChartScreen } from './src/screens/CompatibilityChartScreen';
import { TopicDetailScreen } from './src/screens/TopicDetailScreen';
import { AskWhatMattersScreen } from './src/screens/AskWhatMattersScreen';
import { NextChaiScreen } from './src/screens/NextChaiScreen';
import { UpdateAnswersScreen } from './src/screens/UpdateAnswersScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

function MainNavigator() {
  const { currentScreen } = useApp();

  const renderScreen = () => {
    switch (currentScreen) {
      case 'WELCOME':
        return <WelcomeScreen />;
      case 'HOW_IT_WORKS':
        return <HowItWorksScreen />;
      case 'PRIVACY_PROMISES':
        return <PrivacyPromisesScreen />;
      case 'SIGN_UP':
        return <SignUpScreen />;
      case 'PAIRING':
        return <PairingScreen />;
      case 'CHOOSE_TOPICS':
        return <ChooseTopicsScreen />;
      case 'HEAVY_GATE':
        return <HeavyGateScreen />;
      case 'QUESTIONNAIRE':
        return <QuestionnaireScreen />;
      case 'WAITING_FOR_PARTNER':
        return <WaitingScreen />;
      case 'REVEAL':
        return <RevealScreen />;
      case 'COMPATIBILITY_CHART':
        return <CompatibilityChartScreen />;
      case 'TOPIC_DETAIL':
        return <TopicDetailScreen />;
      case 'ASK_WHAT_MATTERS':
        return <AskWhatMattersScreen />;
      case 'NEXT_CHAI':
        return <NextChaiScreen />;
      case 'UPDATE_ANSWERS':
        return <UpdateAnswersScreen />;
      case 'SETTINGS':
        return <SettingsScreen />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Interactive Demo bar for switching between You & Partner and testing */}
      <DemoControlBar />

      {/* Current Screen */}
      <View style={styles.screenWrapper}>
        {renderScreen()}
      </View>

      {/* Safety Overlays */}
      <QuickHideOverlay />
      <AppLockModal />
    </View>
  );
}

export default function App() {
  const fontsLoaded = useAppFonts();

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={PALETTE.ground} />
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: PALETTE.ground,
    ...Platform.select({
      web: {
        height: '100%',
        maxWidth: 480,
        marginHorizontal: 'auto',
      },
    }),
  },
  container: {
    flex: 1,
    backgroundColor: PALETTE.ground,
  },
  screenWrapper: {
    flex: 1,
  },
});
