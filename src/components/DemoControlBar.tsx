import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { PALETTE, RADIUS } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { useApp } from '../context/AppContext';
import { ScreenName } from '../types';

export const DemoControlBar: React.FC = () => {
  const {
    activeUser,
    switchActiveUser,
    currentScreen,
    navigateTo,
    resetDemo,
    loadCompletedState,
    setQuickHideActive,
    lockApp,
    isPartnerFinished,
    setPartnerFinished,
  } = useApp();

  const [expanded, setExpanded] = useState(false);

  const screens: Array<{ name: ScreenName; label: string }> = [
    { name: 'WELCOME', label: '1. Welcome' },
    { name: 'HOW_IT_WORKS', label: '2. How Works' },
    { name: 'PRIVACY_PROMISES', label: '3. Privacy' },
    { name: 'SIGN_UP', label: '4. Sign Up' },
    { name: 'PAIRING', label: '5. Pairing' },
    { name: 'CHOOSE_TOPICS', label: '6. Topics' },
    { name: 'HEAVY_GATE', label: '7. Gate' },
    { name: 'QUESTIONNAIRE', label: '8. Questions' },
    { name: 'WAITING_FOR_PARTNER', label: '9. Waiting' },
    { name: 'REVEAL', label: '10. Reveal' },
    { name: 'COMPATIBILITY_CHART', label: '11. Chart' },
    { name: 'TOPIC_DETAIL', label: '12. Detail' },
    { name: 'ASK_WHAT_MATTERS', label: '13. Ask Matters' },
    { name: 'NEXT_CHAI', label: '14. Next Chai' },
    { name: 'UPDATE_ANSWERS', label: '15. Update' },
    { name: 'SETTINGS', label: '16. Settings' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.barRow}>
        {/* Active User Switcher */}
        <TouchableOpacity
          onPress={switchActiveUser}
          style={styles.userBadge}
          accessibilityLabel={`Active identity: ${activeUser.displayName}. Tap to switch partner.`}
        >
          <Text style={[styles.userBadgeText, getGroteskFont('600')]}>
            👤 Active: <Text style={styles.userName}>{activeUser.displayName}</Text> (Tap to Switch)
          </Text>
        </TouchableOpacity>

        <View style={styles.rightActions}>
          {/* Quick Hide Trigger */}
          <TouchableOpacity
            onPress={() => setQuickHideActive(true)}
            style={styles.iconBtn}
            accessibilityLabel="Trigger Quick Hide"
          >
            <Text style={styles.iconBtnText}>🛡️ Hide</Text>
          </TouchableOpacity>

          {/* Expand Menu Toggle */}
          <TouchableOpacity
            onPress={() => setExpanded(!expanded)}
            style={styles.menuToggle}
          >
            <Text style={[styles.menuToggleText, getGroteskFont('600')]}>
              {expanded ? '▲ Close' : '▼ Demo Tools'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Expanded Demo Controls Drawer */}
      {expanded && (
        <View style={styles.expandedDrawer}>
          <Text style={[styles.drawerTitle, getGroteskFont('600')]}>
            JUMP TO SCREEN:
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.screenPillsRow}
          >
            {screens.map((s) => (
              <TouchableOpacity
                key={s.name}
                onPress={() => {
                  navigateTo(s.name);
                  setExpanded(false);
                }}
                style={[
                  styles.screenPill,
                  currentScreen === s.name && styles.screenPillActive,
                ]}
              >
                <Text
                  style={[
                    styles.screenPillText,
                    getGroteskFont('500'),
                    currentScreen === s.name && styles.screenPillTextActive,
                  ]}
                >
                  {s.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.quickActionRow}>
            <TouchableOpacity
              onPress={() => {
                loadCompletedState();
                setExpanded(false);
              }}
              style={styles.actionBtn}
            >
              <Text style={[styles.actionBtnText, getGroteskFont('600')]}>
                ⚡ Jump to Results Chart
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setPartnerFinished(!isPartnerFinished)}
              style={styles.actionBtn}
            >
              <Text style={[styles.actionBtnText, getGroteskFont('600')]}>
                {isPartnerFinished ? 'Toggle Partner: Answering' : 'Toggle Partner: Finished'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                lockApp();
                setExpanded(false);
              }}
              style={styles.actionBtn}
            >
              <Text style={[styles.actionBtnText, getGroteskFont('600')]}>
                🔒 Test PIN Lock
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                resetDemo();
                setExpanded(false);
              }}
              style={[styles.actionBtn, styles.resetBtn]}
            >
              <Text style={[styles.actionBtnText, getGroteskFont('600')]}>
                🔄 Reset Prototype
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E050B',
    borderBottomWidth: 1,
    borderBottomColor: PALETTE.line,
    zIndex: 999,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  userBadge: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.pill,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  userBadgeText: {
    color: PALETTE.mist,
    fontSize: 12,
  },
  userName: {
    color: PALETTE.marigold,
    fontWeight: 'bold',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: PALETTE.ground2,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: RADIUS.pill,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  iconBtnText: {
    color: PALETTE.paper,
    fontSize: 11,
  },
  menuToggle: {
    backgroundColor: PALETTE.line,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: RADIUS.pill,
  },
  menuToggleText: {
    color: PALETTE.cloud,
    fontSize: 11,
  },
  expandedDrawer: {
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: PALETTE.line,
    backgroundColor: '#170308',
  },
  drawerTitle: {
    color: PALETTE.mist,
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 6,
  },
  screenPillsRow: {
    gap: 6,
    paddingBottom: 8,
  },
  screenPill: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  screenPillActive: {
    backgroundColor: PALETTE.paper,
    borderColor: PALETTE.paper,
  },
  screenPillText: {
    color: PALETTE.mist,
    fontSize: 12,
  },
  screenPillTextActive: {
    color: PALETTE.ink,
    fontWeight: 'bold',
  },
  quickActionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  actionBtn: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  actionBtnText: {
    color: PALETTE.paper,
    fontSize: 11,
  },
  resetBtn: {
    borderColor: PALETTE.rose,
  },
});
