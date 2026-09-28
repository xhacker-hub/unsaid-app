import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { PALETTE, RADIUS, BORDERS, TYPOGRAPHY } from '../theme/tokens';
import { getGroteskFont, getHandFont } from '../theme/fonts';

interface PrivateNoteFieldProps {
  note?: string;
  onNoteChange: (text: string) => void;
}

export const PrivateNoteField: React.FC<PrivateNoteFieldProps> = ({
  note = '',
  onNoteChange,
}) => {
  const [expanded, setExpanded] = useState(Boolean(note));
  const [isFocused, setIsFocused] = useState(false);
  const [typedPlaceholder, setTypedPlaceholder] = useState('');
  const fullPlaceholder = 'A private note for yourself (e.g. what I want to ask in person)—';
  const typingTimerRef = useRef<any>(null);

  // Self-typing placeholder in handwritten Shantell Sans font
  useEffect(() => {
    if (expanded && !note && !isFocused) {
      let idx = 0;
      setTypedPlaceholder('');

      const typeNext = () => {
        if (idx <= fullPlaceholder.length) {
          setTypedPlaceholder(fullPlaceholder.substring(0, idx));
          idx++;
          const char = fullPlaceholder.charAt(idx - 1);
          const delay = char === ' ' ? 80 : char === ',' ? 180 : 38;
          typingTimerRef.current = setTimeout(typeNext, delay);
        }
      };

      typingTimerRef.current = setTimeout(typeNext, 200);

      return () => {
        if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      };
    }
  }, [expanded, isFocused, note]);

  return (
    <View style={styles.container}>
      {!expanded ? (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setExpanded(true)}
          style={styles.expandButton}
        >
          <Text style={[styles.expandButtonText, getGroteskFont('500')]}>
            + Add a private note (only for you)
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.fieldWrapper}>
          <View style={styles.noteHeader}>
            <Text style={[styles.noteHeaderTitle, getGroteskFont('600')]}>
              PRIVATE NOTE (ONLY VISIBLE TO YOU)
            </Text>
            <TouchableOpacity onPress={() => setExpanded(false)}>
              <Text style={[styles.collapseLink, getGroteskFont('500')]}>
                Hide
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input with 2px dashed border that turns solid on focus (Section 7.3) */}
          <View
            style={[
              styles.inputBox,
              isFocused ? styles.inputBoxFocused : styles.inputBoxDashed,
            ]}
          >
            <TextInput
              value={note}
              onChangeText={onNoteChange}
              onFocus={() => {
                setIsFocused(true);
                if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
              }}
              onBlur={() => setIsFocused(false)}
              placeholder={isFocused ? '' : typedPlaceholder || 'A private note for yourself—'}
              placeholderTextColor="rgba(36, 6, 13, 0.45)"
              multiline
              numberOfLines={3}
              style={[
                styles.textInput,
                note ? getGroteskFont('400') : getHandFont('400'),
              ]}
              accessibilityLabel="Private note field. Only visible to you unless explicitly shared."
            />
          </View>

          <Text style={[styles.privacyHint, getGroteskFont('400')]}>
            Your partner cannot see this unless you choose to share it later.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  expandButton: {
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  expandButtonText: {
    color: PALETTE.mist,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  fieldWrapper: {
    backgroundColor: PALETTE.ground2,
    borderRadius: RADIUS.card,
    padding: 14,
    borderWidth: 1,
    borderColor: PALETTE.line,
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteHeaderTitle: {
    fontSize: 11,
    letterSpacing: TYPOGRAPHY.letterSpacing.label,
    color: PALETTE.mist,
  },
  collapseLink: {
    fontSize: 12,
    color: PALETTE.mist,
  },
  inputBox: {
    backgroundColor: PALETTE.cloud,
    borderRadius: RADIUS.input, // 12px radius
    padding: 12,
    minHeight: 80,
    justifyContent: 'flex-start',
  },
  inputBoxDashed: {
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.ink,
    borderStyle: 'dashed',
  },
  inputBoxFocused: {
    borderWidth: BORDERS.ink2px,
    borderColor: PALETTE.ink,
    borderStyle: 'solid',
  },
  textInput: {
    color: PALETTE.ink,
    fontSize: 15,
    lineHeight: 22,
    padding: 0,
    textAlignVertical: 'top',
  },
  privacyHint: {
    fontSize: 12,
    color: PALETTE.mist,
    marginTop: 6,
    opacity: 0.8,
  },
});
