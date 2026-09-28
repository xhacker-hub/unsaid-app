import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Answer,
  AskItem,
  ChartResult,
  Pair,
  Question,
  ScreenName,
  Topic,
  TopicConsent,
  TopicShare,
  User,
} from '../types';
import { TOPICS } from '../data/topics';
import { QUESTIONS } from '../data/questions';
import {
  MOCK_USER_A,
  MOCK_USER_B,
  MOCK_PAIR,
  INITIAL_ANSWERS_ARJUN,
  INITIAL_ANSWERS_MEERA,
} from '../data/mockState';
import {
  calculateTopicScore,
  sortTopicResults,
  generateAskItems,
} from '../scoring/compatibility';

interface AppContextType {
  // Navigation
  currentScreen: ScreenName;
  navigateTo: (screen: ScreenName) => void;
  goBack: () => void;
  canGoBack: boolean;

  // Active user (allows switching between Arjun & Meera on one device)
  activeUser: User;
  partnerUser: User;
  switchActiveUser: () => void;
  setUserName: (name: string) => void;

  // Pair & Onboarding
  pair: Pair;
  partnerJoined: boolean;
  setPartnerJoined: (joined: boolean) => void;
  pairInviteCode: string;
  confirmPair: () => void;
  unpair: () => void;
  deleteEverything: () => void;

  // Topics & Consent
  topics: Topic[];
  userConsentA: Record<string, boolean>;
  userConsentB: Record<string, boolean>;
  toggleTopicConsent: (topicId: string) => void;
  commonTopicIds: Set<string>;
  currentTopicId: string;
  setCurrentTopicId: (id: string) => void;

  // Questionnaire Flow
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (idx: number) => void;
  activeUserAnswers: Record<string, Answer>;
  saveCurrentAnswer: (
    questionId: string,
    value: any,
    importance: 1 | 2 | 3,
    dealbreaker: boolean,
    note?: string
  ) => void;
  skipCurrentQuestion: (questionId: string) => void;
  markInPerson: (questionId: string) => void;
  markPreferNotToSay: (questionId: string) => void;

  // Questionnaire Completion
  isUserFinished: boolean;
  isPartnerFinished: boolean;
  setPartnerFinished: (finished: boolean) => void;
  reminderSent: boolean;
  sendGentleReminder: () => void;

  // Reveal & Chart
  revealSeen: boolean;
  setRevealSeen: (seen: boolean) => void;
  chartResults: ChartResult[];
  selectedTopicForDetail: string | null;
  setSelectedTopicForDetail: (topicId: string | null) => void;
  topicShares: Record<string, boolean>; // topicId -> show raw answers for sensitive topic
  toggleTopicShare: (topicId: string) => void;

  // Next Chai & Ask What Matters
  askItems: AskItem[];
  nextChaiItems: AskItem[];
  saveToNextChai: (questionId: string) => void;
  markTalked: (questionId: string) => void;
  dismissAsk: (questionId: string) => void;

  // Settings & Safety
  quickHideActive: boolean;
  setQuickHideActive: (active: boolean) => void;
  appLocked: boolean;
  unlockApp: (pin: string) => boolean;
  lockApp: () => void;
  reducedMotion: boolean;
  setReducedMotion: (val: boolean) => void;
  discreetNotifications: boolean;
  setDiscreetNotifications: (val: boolean) => void;

  // Demo Helpers
  resetDemo: () => void;
  loadCompletedState: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation stack
  const [screenStack, setScreenStack] = useState<ScreenName[]>(['WELCOME']);
  const currentScreen = screenStack[screenStack.length - 1] || 'WELCOME';

  const navigateTo = (screen: ScreenName) => {
    setScreenStack((prev) => [...prev, screen]);
  };

  const goBack = () => {
    setScreenStack((prev) => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  const canGoBack = screenStack.length > 1;

  // Users & Active identity
  const [currentUserKey, setCurrentUserKey] = useState<'A' | 'B'>('A');
  const [userA, setUserA] = useState<User>(MOCK_USER_A);
  const [userB, setUserB] = useState<User>(MOCK_USER_B);

  const activeUser = currentUserKey === 'A' ? userA : userB;
  const partnerUser = currentUserKey === 'A' ? userB : userA;

  const switchActiveUser = () => {
    setCurrentUserKey((prev) => (prev === 'A' ? 'B' : 'A'));
  };

  const setUserName = (name: string) => {
    if (currentUserKey === 'A') {
      setUserA((prev) => ({ ...prev, displayName: name }));
    } else {
      setUserB((prev) => ({ ...prev, displayName: name }));
    }
  };

  // Pair state
  const [pair, setPair] = useState<Pair>(MOCK_PAIR);
  const [partnerJoined, setPartnerJoined] = useState(true);

  const confirmPair = () => {
    setPair((prev) => ({ ...prev, status: 'active' }));
    setPartnerJoined(true);
  };

  const unpair = () => {
    setPair((prev) => ({ ...prev, status: 'ended' }));
  };

  // Topic consent (Symmetric consent: Light topics default ON, sensitive topics default OFF)
  const [userConsentA, setUserConsentA] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    TOPICS.forEach((t) => {
      map[t.id] = !t.sensitive;
    });
    // For demo richness, opt-in to a couple sensitive ones as well
    map['mental_health'] = true;
    map['intimacy'] = true;
    return map;
  });

  const [userConsentB, setUserConsentB] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    TOPICS.forEach((t) => {
      map[t.id] = !t.sensitive;
    });
    map['mental_health'] = true;
    map['intimacy'] = true;
    return map;
  });

  const toggleTopicConsent = (topicId: string) => {
    if (currentUserKey === 'A') {
      setUserConsentA((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
    } else {
      setUserConsentB((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
    }
  };

  // Common opted-in topics
  const commonTopicIds = useMemo(() => {
    const set = new Set<string>();
    TOPICS.forEach((t) => {
      if (userConsentA[t.id] && userConsentB[t.id]) {
        set.add(t.id);
      }
    });
    return set;
  }, [userConsentA, userConsentB]);

  // Answers store
  const [answersA, setAnswersA] = useState<Record<string, Answer>>(INITIAL_ANSWERS_ARJUN);
  const [answersB, setAnswersB] = useState<Record<string, Answer>>(INITIAL_ANSWERS_MEERA);

  const activeUserAnswers = currentUserKey === 'A' ? answersA : answersB;

  // Questionnaire position
  const [currentTopicId, setCurrentTopicId] = useState<string>('family');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

  // Completion statuses
  const [isUserFinished, setIsUserFinished] = useState<boolean>(true);
  const [isPartnerFinished, setIsPartnerFinished] = useState<boolean>(true);
  const [reminderSent, setReminderSent] = useState<boolean>(false);

  const sendGentleReminder = () => {
    setReminderSent(true);
  };

  // Reveal
  const [revealSeen, setRevealSeen] = useState<boolean>(true);

  // Selected topic for detail screen
  const [selectedTopicForDetail, setSelectedTopicForDetail] = useState<string | null>('family');

  // Topic raw answer sharing for sensitive topics (off by default)
  const [topicShares, setTopicShares] = useState<Record<string, boolean>>({
    mental_health: false,
    intimacy: false,
    trauma: false,
    past: false,
  });

  const toggleTopicShare = (topicId: string) => {
    setTopicShares((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  // Save answer
  const saveCurrentAnswer = (
    questionId: string,
    value: any,
    importance: 1 | 2 | 3,
    dealbreaker: boolean,
    note?: string
  ) => {
    const ans: Answer = {
      userId: activeUser.id,
      questionId,
      value,
      skipped: false,
      inPerson: false,
      preferNot: false,
      importance,
      dealbreaker,
      note,
      noteShared: !!note,
      updatedAt: new Date().toISOString(),
    };

    if (currentUserKey === 'A') {
      setAnswersA((prev) => ({ ...prev, [questionId]: ans }));
    } else {
      setAnswersB((prev) => ({ ...prev, [questionId]: ans }));
    }
  };

  const skipCurrentQuestion = (questionId: string) => {
    const ans: Answer = {
      userId: activeUser.id,
      questionId,
      skipped: true,
      inPerson: false,
      preferNot: false,
      importance: 1,
      dealbreaker: false,
      noteShared: false,
      updatedAt: new Date().toISOString(),
    };

    if (currentUserKey === 'A') {
      setAnswersA((prev) => ({ ...prev, [questionId]: ans }));
    } else {
      setAnswersB((prev) => ({ ...prev, [questionId]: ans }));
    }
  };

  const markInPerson = (questionId: string) => {
    const ans: Answer = {
      userId: activeUser.id,
      questionId,
      skipped: false,
      inPerson: true,
      preferNot: false,
      importance: 2,
      dealbreaker: false,
      noteShared: false,
      updatedAt: new Date().toISOString(),
    };

    if (currentUserKey === 'A') {
      setAnswersA((prev) => ({ ...prev, [questionId]: ans }));
    } else {
      setAnswersB((prev) => ({ ...prev, [questionId]: ans }));
    }
  };

  const markPreferNotToSay = (questionId: string) => {
    const ans: Answer = {
      userId: activeUser.id,
      questionId,
      skipped: false,
      inPerson: false,
      preferNot: true,
      importance: 1,
      dealbreaker: false,
      noteShared: false,
      updatedAt: new Date().toISOString(),
    };

    if (currentUserKey === 'A') {
      setAnswersA((prev) => ({ ...prev, [questionId]: ans }));
    } else {
      setAnswersB((prev) => ({ ...prev, [questionId]: ans }));
    }
  };

  // Ask Items state (Next chai / Ask what matters)
  const [askStatusMap, setAskStatusMap] = useState<Record<string, 'suggested' | 'saved' | 'talked' | 'notNow'>>({
    money_debt: 'saved',
    children_count: 'saved',
  });

  const saveToNextChai = (questionId: string) => {
    setAskStatusMap((prev) => ({ ...prev, [questionId]: 'saved' }));
  };

  const markTalked = (questionId: string) => {
    setAskStatusMap((prev) => ({ ...prev, [questionId]: 'talked' }));
  };

  const dismissAsk = (questionId: string) => {
    setAskStatusMap((prev) => ({ ...prev, [questionId]: 'notNow' }));
  };

  // Calculate Chart results dynamically based on current answers
  const chartResults = useMemo(() => {
    const results: ChartResult[] = [];

    TOPICS.forEach((topic) => {
      // Only include topics that BOTH users agreed to compare
      if (commonTopicIds.has(topic.id)) {
        const res = calculateTopicScore(pair.id, topic, QUESTIONS, answersA, answersB);
        results.push(res);
      }
    });

    return sortTopicResults(results);
  }, [commonTopicIds, pair.id, answersA, answersB]);

  // Generate Ask Items
  const { allItems: askItems, topNextChai: nextChaiItems } = useMemo(() => {
    const existingItems: Record<string, AskItem> = {};
    Object.entries(askStatusMap).forEach(([qId, st]) => {
      const q = QUESTIONS.find((x) => x.id === qId);
      if (q) {
        existingItems[qId] = {
          pairId: pair.id,
          questionId: qId,
          suggestedText: q.suggestedAskText,
          tip: q.suggestedAskTip,
          gapScore: 1,
          dealbreakerConflict: false,
          status: st,
        };
      }
    });

    const gen = generateAskItems(pair.id, QUESTIONS, answersA, answersB, commonTopicIds, existingItems);

    // Filter items currently marked as 'saved' for the Next Chai list
    const saved = gen.allItems.filter((i) => askStatusMap[i.questionId] === 'saved');
    const finalNextChai = saved.length > 0 ? saved.slice(0, 3) : gen.topNextChai;

    return { allItems: gen.allItems, topNextChai: finalNextChai };
  }, [pair.id, answersA, answersB, commonTopicIds, askStatusMap]);

  // Safety & Settings
  const [quickHideActive, setQuickHideActive] = useState<boolean>(false);
  const [appLocked, setAppLocked] = useState<boolean>(false);
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);
  const [discreetNotifications, setDiscreetNotifications] = useState<boolean>(true);

  const unlockApp = (pin: string) => {
    if (pin === '1234' || pin === activeUser.settings.pinCode) {
      setAppLocked(false);
      return true;
    }
    return false;
  };

  const lockApp = () => {
    setAppLocked(true);
  };

  // Demo reset
  const resetDemo = () => {
    setAnswersA(INITIAL_ANSWERS_ARJUN);
    setAnswersB(INITIAL_ANSWERS_MEERA);
    setRevealSeen(true);
    setIsUserFinished(true);
    setIsPartnerFinished(true);
    setScreenStack(['WELCOME']);
    setPartnerJoined(true);
    setPair(MOCK_PAIR);
  };

  const loadCompletedState = () => {
    setAnswersA(INITIAL_ANSWERS_ARJUN);
    setAnswersB(INITIAL_ANSWERS_MEERA);
    setRevealSeen(true);
    setIsUserFinished(true);
    setIsPartnerFinished(true);
    setScreenStack(['COMPATIBILITY_CHART']);
  };

  const deleteEverything = () => {
    setAnswersA({});
    setAnswersB({});
    setScreenStack(['WELCOME']);
  };

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        navigateTo,
        goBack,
        canGoBack,
        activeUser,
        partnerUser,
        switchActiveUser,
        setUserName,
        pair,
        partnerJoined,
        setPartnerJoined,
        pairInviteCode: pair.inviteCode,
        confirmPair,
        unpair,
        deleteEverything,
        topics: TOPICS,
        userConsentA,
        userConsentB,
        toggleTopicConsent,
        commonTopicIds,
        currentTopicId,
        setCurrentTopicId,
        questions: QUESTIONS,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        activeUserAnswers,
        saveCurrentAnswer,
        skipCurrentQuestion,
        markInPerson,
        markPreferNotToSay,
        isUserFinished,
        isPartnerFinished,
        setPartnerFinished: setIsPartnerFinished,
        reminderSent,
        sendGentleReminder,
        revealSeen,
        setRevealSeen,
        chartResults,
        selectedTopicForDetail,
        setSelectedTopicForDetail,
        topicShares,
        toggleTopicShare,
        askItems,
        nextChaiItems,
        saveToNextChai,
        markTalked,
        dismissAsk,
        quickHideActive,
        setQuickHideActive,
        appLocked,
        unlockApp,
        lockApp,
        reducedMotion,
        setReducedMotion,
        discreetNotifications,
        setDiscreetNotifications,
        resetDemo,
        loadCompletedState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
