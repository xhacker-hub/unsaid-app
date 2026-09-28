import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateQuestionAlignment,
  calculateTopicScore,
  sortTopicResults,
  generateAskItems,
} from '../compatibility';
import { Answer, Question, Topic } from '../../types';

describe('Unsaid Compatibility Scoring Module (Section 6)', () => {
  const dummyTopic: Topic = {
    id: 'money',
    name: 'Money, loans & debt',
    sensitive: false,
    order: 2,
    description: 'Existing loans, debt, spending vs saving',
  };

  const sampleQuestions: Question[] = [
    {
      id: 'q_debt',
      topicId: 'money',
      text: 'Do you have any loans or debt?',
      type: 'single',
      options: ['None', 'Some', 'Significant', 'Prefer to discuss in person'],
      allowInPerson: true,
      allowPreferNot: true,
      suggestedAskText: 'What does your current financial picture look like in terms of debt?',
      suggestedAskTip: 'Keep it open and non-judgmental. Most people have educational or car loans.',
    },
    {
      id: 'q_save_spend',
      topicId: 'money',
      text: 'How would you describe your spending habits?',
      type: 'scale',
      scaleMin: 1,
      scaleMax: 5,
      options: ['Saver', 'Balanced', 'Spender'],
      allowInPerson: true,
      allowPreferNot: false,
      suggestedAskText: 'How do you like to balance saving for tomorrow versus enjoying today?',
      suggestedAskTip: 'Focus on goals and habits rather than exact numbers.',
    },
    {
      id: 'q_who_decides',
      topicId: 'money',
      text: 'Who in your family decides how money gets spent?',
      type: 'single',
      options: ['Parents', 'Jointly with parents', 'Independently', 'Future spouse and I'],
      partialCredit: {
        'Jointly with parents': { 'Future spouse and I': 0.6 },
        'Parents': { 'Jointly with parents': 0.5 },
      },
      allowInPerson: true,
      allowPreferNot: true,
      suggestedAskText: 'How were major financial decisions made in your house growing up?',
      suggestedAskTip: 'Family patterns shape expectations. Ask about their upbringing.',
    },
    {
      id: 'q_shared_goals',
      topicId: 'money',
      text: 'What are your top financial goals for the next 3 years?',
      type: 'multi',
      options: ['Buying a home', 'Emergency fund', 'Travel', 'Investing', 'Supporting parents'],
      allowInPerson: true,
      allowPreferNot: false,
      suggestedAskText: 'What kind of life are we both hoping to build in the next few years?',
      suggestedAskTip: 'Look for shared dreams and complementary plans.',
    },
  ];

  it('Requirement 1: Identical answers → Strong match (>= 0.80)', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Emergency fund', 'Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Emergency fund', 'Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    assert.equal(score.band, 'Strong match');
    assert.equal(score.alignment, 1);
    assert.equal(score.coverage, 1);
    assert.equal(score.dealbreakerConflict, false);
  });

  it('Requirement 2: Opposite answers → Talk about this (< 0.55)', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 1, skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Parents', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Buying a home'], skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'Significant', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 5, skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Independently', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Travel'], skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    assert.equal(score.band, 'Talk about this');
    assert.ok(score.alignment < 0.55, `Expected alignment < 0.55, got ${score.alignment}`);
  });

  it('Requirement 3: All skipped or < 50% answered → Not answered yet', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    assert.equal(score.band, 'Not answered yet');
    assert.equal(score.coverage, 0);
  });

  it('Requirement 4: A dealbreaker overrides the band and adds flag "Important to one of you"', () => {
    // Both match closely on 3 questions (alignment ~0.9), but one question has a dealbreaker with alignment 0
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: true, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Emergency fund'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'Significant', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Emergency fund'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    assert.equal(score.band, 'Talk about this');
    assert.equal(score.dealbreakerConflict, true);
    assert.ok(score.flags.includes('Important to one of you'));
  });

  it('Requirement 5: Order independence (A, B) === (B, A)', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 2, skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: true, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Jointly with parents', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Emergency fund', 'Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'Some', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 4, skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Travel', 'Investing'], skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
    };

    const scoreAB = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    const scoreBA = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersB, answersA);

    assert.equal(scoreAB.band, scoreBA.band);
    assert.equal(scoreAB.alignment.toFixed(4), scoreBA.alignment.toFixed(4));
    assert.equal(scoreAB.coverage, scoreBA.coverage);
    assert.equal(scoreAB.dealbreakerConflict, scoreBA.dealbreakerConflict);
  });

  it('Requirement 6: Skips never lower a score (coverage reduced, but alignment based only on answered)', () => {
    // 2 questions answered with 100% match, 2 skipped
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', skipped: true, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    assert.equal(score.band, 'Strong match');
    assert.equal(score.alignment, 1.0);
    assert.equal(score.coverage, 0.5); // 50% answered
  });

  it('Requirement 7: Partial credit matrix works symmetrically', () => {
    const q = sampleQuestions.find((item) => item.id === 'q_who_decides')!;
    const ansA: Answer = { userId: 'u1', questionId: 'q_who_decides', value: 'Jointly with parents', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false };
    const ansB: Answer = { userId: 'u2', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false };

    const resAB = calculateQuestionAlignment(q, ansA, ansB);
    const resBA = calculateQuestionAlignment(q, ansB, ansA);

    assert.equal(resAB.alignment, 0.6);
    assert.equal(resBA.alignment, 0.6);
  });

  it('Requirement 8: Multi-select Jaccard similarity', () => {
    const q = sampleQuestions.find((item) => item.id === 'q_shared_goals')!;
    // Set A: [Emergency fund, Travel]
    // Set B: [Travel, Investing]
    // Intersection: 1 (Travel), Union: 3 (Emergency, Travel, Investing) -> 1/3 = 0.3333
    const ansA: Answer = { userId: 'u1', questionId: 'q_shared_goals', value: ['Emergency fund', 'Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false };
    const ansB: Answer = { userId: 'u2', questionId: 'q_shared_goals', value: ['Travel', 'Investing'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false };

    const res = calculateQuestionAlignment(q, ansA, ansB);
    assert.equal(res.alignment.toFixed(3), '0.333');
  });

  it('Requirement 9: "Prefer to discuss in person" is excluded from numeric topic score', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', inPerson: true, skipped: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Travel'], skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 3, skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Future spouse and I', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Travel'], skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
    };

    const score = calculateTopicScore('pair_1', dummyTopic, sampleQuestions, answersA, answersB);
    // 3 answered questions are 100% matched, debt is in-person excluded
    assert.equal(score.band, 'Strong match');
    assert.equal(score.alignment, 1.0);
    assert.equal(score.coverage, 1.0);
  });

  it('Requirement 10: "Ask what matters" ordering prioritizes dealbreakers first, then (1 - alignment) * weight', () => {
    const answersA: Record<string, Answer> = {
      q_debt: { userId: 'u1', questionId: 'q_debt', value: 'None', skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: true, noteShared: false },
      q_save_spend: { userId: 'u1', questionId: 'q_save_spend', value: 1, skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u1', questionId: 'q_who_decides', value: 'Parents', skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u1', questionId: 'q_shared_goals', value: ['Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const answersB: Record<string, Answer> = {
      q_debt: { userId: 'u2', questionId: 'q_debt', value: 'Significant', skipped: false, inPerson: false, preferNot: false, importance: 2, dealbreaker: false, noteShared: false },
      q_save_spend: { userId: 'u2', questionId: 'q_save_spend', value: 5, skipped: false, inPerson: false, preferNot: false, importance: 3, dealbreaker: false, noteShared: false },
      q_who_decides: { userId: 'u2', questionId: 'q_who_decides', value: 'Independently', skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
      q_shared_goals: { userId: 'u2', questionId: 'q_shared_goals', value: ['Travel'], skipped: false, inPerson: false, preferNot: false, importance: 1, dealbreaker: false, noteShared: false },
    };

    const { allItems, topNextChai } = generateAskItems('pair_1', sampleQuestions, answersA, answersB);

    assert.equal(allItems[0].questionId, 'q_debt', 'Dealbreaker conflict must come first');
    assert.equal(allItems[0].dealbreakerConflict, true);
    assert.equal(allItems[1].questionId, 'q_save_spend', 'Highest gap * weight should be second');
    assert.equal(topNextChai.length, 3, 'Top 3 items for next chai');
  });

  it('Requirement 11: Sort topic results orders: Talk about this -> Some gaps -> Strong match -> Not answered yet', () => {
    const list = [
      { pairId: 'p', topicId: 't1', band: 'Strong match' as const, coverage: 1, alignment: 0.9, dealbreakerConflict: false, flags: [] },
      { pairId: 'p', topicId: 't2', band: 'Talk about this' as const, coverage: 1, alignment: 0.4, dealbreakerConflict: false, flags: [] },
      { pairId: 'p', topicId: 't3', band: 'Not answered yet' as const, coverage: 0.2, alignment: 0, dealbreakerConflict: false, flags: [] },
      { pairId: 'p', topicId: 't4', band: 'Some gaps' as const, coverage: 1, alignment: 0.65, dealbreakerConflict: false, flags: [] },
    ];

    const sorted = sortTopicResults(list);
    assert.equal(sorted[0].band, 'Talk about this');
    assert.equal(sorted[1].band, 'Some gaps');
    assert.equal(sorted[2].band, 'Strong match');
    assert.equal(sorted[3].band, 'Not answered yet');
  });
});
