import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont } from '../theme/fonts';
import { Topic } from '../types';

interface TopicToggleProps {
  topic: Topic;
  selected: boolean;
  onToggle: () => void;
}

export const TopicToggle: React.FC<TopicToggleProps> = ({
  topic,
  selected,
  onToggle,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onToggle}
      style={[
        styles.card,
        selected ? styles.selectedCard : styles.unselectedCard,
      ]}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={`${topic.name}. ${topic.sensitive ? 'Sensitive topic.' : ''} ${selected ? 'Selected' : 'Not selected'}`}
    >
      <View style={styles.topRow}>
        <View style={styles.titleArea}>
          <Text
            style={[
              styles.title,
              getGroteskFont('600'),
              selected ? styles.titleSelected : styles.titleUnselected,
            ]}
          >
            {topic.name}
          </Text>
          {topic.sensitive && (
            <View style={styles.sensitiveBadge}>
              <Text style={[styles.sensitiveBadgeText, getGroteskFont('600')]}>
                Sensitive
              </Text>
            </View>
          )}
        </View>

        {/* Custom checkbox box */}
        <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
          {selected && (
            <Text style={styles.checkmark}>✓</Text>
          )}
        </View>
      </View>

      <Text
        style={[
          styles.description,
          getGroteskFont('400'),
          selected ? styles.descSelected : styles.descUnselected,
        ]}
      >
        {topic.description}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: RADIUS.card,
    borderWidth: BORDERS.ink2px,
    padding: 16,
    marginVertical: 6,
  },
  selectedCard: {
    backgroundColor: PALETTE.cloud,
    borderColor: PALETTE.ink,
  },
  unselectedCard: {
    backgroundColor: PALETTE.ground2,
    borderColor: PALETTE.line,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleArea: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    flex: 1,
  },
  title: {
    fontSize: 18,
  },
  titleSelected: {
    color: PALETTE.ink,
  },
  titleUnselected: {
    color: PALETTE.paper,
  },
  sensitiveBadge: {
    backgroundColor: PALETTE.wine,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.pill,
  },
  sensitiveBadgeText: {
    color: PALETTE.paper,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: PALETTE.mist,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  checkboxSelected: {
    backgroundColor: PALETTE.ink,
    borderColor: PALETTE.ink,
  },
  checkmark: {
    color: PALETTE.cloud,
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 18,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
  },
  descSelected: {
    color: PALETTE.ink,
    opacity: 0.8,
  },
  descUnselected: {
    color: PALETTE.mist,
  },
});
