import {
  Answer,
  AskItem,
  ChartResult,
  CompatibilityBand,
  Question,
  Topic,
} from '../types';

export interface QuestionAlignmentResult {
  questionId: string;
  alignment: number; // 0 to 1
  weight: number; // 1 to 3
  isExcluded: boolean;
  isInPerson: boolean;
  isSkipped: boolean;
  dealbreakerConflict: boolean;
  gapScore: number; // (1 - alignment) * weight
}

/**
 * Calculates alignment for a single question between two users' answers.
 * Returns alignment in [0, 1], weight, exclusion status, and dealbreaker flag.
 */
export function calculateQuestionAlignment(
  question: Question,
  ansA?: Answer,
  ansB?: Answer
): QuestionAlignmentResult {
  // If either didn't answer or skipped
  if (!ansA || !ansB || ansA.skipped || ansB.skipped) {
    return {
      questionId: question.id,
      alignment: 0,
      weight: 1,
      isExcluded: true,
      isInPerson: false,
      isSkipped: true,
      dealbreakerConflict: false,
      gapScore: 0,
    };
  }

  // Weight is max(importanceA, importanceB)
  const weight = Math.max(ansA.importance || 1, ansB.importance || 1);

  // If either opted for in-person discussion or prefers not to say
  if (ansA.inPerson || ansB.inPerson || ansA.preferNot || ansB.preferNot) {
    const isDealbreaker = ansA.dealbreaker || ansB.dealbreaker;
    return {
      questionId: question.id,
      alignment: 0.5,
      weight,
      isExcluded: true,
      isInPerson: true,
      isSkipped: false,
      dealbreakerConflict: isDealbreaker,
      gapScore: 0.8 * weight, // high priority for discussion
    };
  }

  let alignment = 0;

  switch (question.type) {
    case 'scale': {
      const min = question.scaleMin ?? 1;
      const max = question.scaleMax ?? 5;
      const range = Math.max(1, max - min);
      const valA = Number(ansA.value ?? min);
      const valB = Number(ansB.value ?? min);
      alignment = Math.max(0, Math.min(1, 1 - Math.abs(valA - valB) / range));
      break;
    }

    case 'multi': {
      const setA = new Set(Array.isArray(ansA.value) ? ansA.value : [ansA.value]);
      const setB = new Set(Array.isArray(ansB.value) ? ansB.value : [ansB.value]);

      if (setA.size === 0 && setB.size === 0) {
        alignment = 1;
      } else {
        let intersectionCount = 0;
        setA.forEach((item) => {
          if (setB.has(item)) intersectionCount++;
        });
        const unionCount = new Set([...setA, ...setB]).size;
        alignment = unionCount > 0 ? intersectionCount / unionCount : 1;
      }
      break;
    }

    case 'single':
    default: {
      const valA = String(ansA.value ?? '');
      const valB = String(ansB.value ?? '');

      if (valA === valB) {
        alignment = 1;
      } else {
        // Check partial credit matrix if configured (order independent)
        const matrix = question.partialCredit;
        if (matrix && matrix[valA] && matrix[valA][valB] !== undefined) {
          alignment = matrix[valA][valB];
        } else if (matrix && matrix[valB] && matrix[valB][valA] !== undefined) {
          alignment = matrix[valB][valA];
        } else {
          alignment = 0;
        }
      }
      break;
    }
  }

  const hasDealbreaker = ansA.dealbreaker || ansB.dealbreaker;
  const dealbreakerConflict = hasDealbreaker && alignment < 0.8;
  const gapScore = (1 - alignment) * weight;

  return {
    questionId: question.id,
    alignment,
    weight,
    isExcluded: false,
    isInPerson: false,
    isSkipped: false,
    dealbreakerConflict,
    gapScore,
  };
}

/**
 * Computes topic-level compatibility score, band, and flags.
 */
export function calculateTopicScore(
  pairId: string,
  topic: Topic,
  questions: Question[],
  answersA: Record<string, Answer>,
  answersB: Record<string, Answer>
): ChartResult {
  const topicQuestions = questions.filter((q) => q.topicId === topic.id);
  const totalQuestions = topicQuestions.length;

  if (totalQuestions === 0) {
    return {
      pairId,
      topicId: topic.id,
      band: 'Not answered yet',
      coverage: 0,
      alignment: 0,
      dealbreakerConflict: false,
      flags: [],
    };
  }

  let answeredCount = 0;
  let inPersonOnlyCount = 0;
  let totalWeightedAlignment = 0;
  let totalWeight = 0;
  let hasDealbreakerConflict = false;

  for (const q of topicQuestions) {
    const ansA = answersA[q.id];
    const ansB = answersB[q.id];

    // Both must have responded (not skipped)
    if (ansA && ansB && !ansA.skipped && !ansB.skipped) {
      answeredCount++;
      const qRes = calculateQuestionAlignment(q, ansA, ansB);

      if (qRes.dealbreakerConflict) {
        hasDealbreakerConflict = true;
      }

      if (qRes.isInPerson) {
        inPersonOnlyCount++;
      } else if (!qRes.isExcluded) {
        totalWeightedAlignment += qRes.alignment * qRes.weight;
        totalWeight += qRes.weight;
      }
    }
  }

  const coverage = totalQuestions > 0 ? answeredCount / totalQuestions : 0;
  const flags: string[] = [];

  // Coverage requirement: At least 50% must be answered
  if (coverage < 0.5) {
    return {
      pairId,
      topicId: topic.id,
      band: 'Not answered yet',
      coverage,
      alignment: 0,
      dealbreakerConflict: false,
      flags,
    };
  }

  // If all answered questions are marked for in-person discussion
  if (totalWeight === 0 && inPersonOnlyCount > 0) {
    return {
      pairId,
      topicId: topic.id,
      band: 'Talk in person',
      coverage,
      alignment: 0.5,
      dealbreakerConflict: false,
      flags: ['Prefer to discuss in person'],
    };
  }

  const meanAlignment = totalWeight > 0 ? totalWeightedAlignment / totalWeight : 0;

  // Determine band
  let band: CompatibilityBand;
  if (meanAlignment >= 0.8) {
    band = 'Strong match';
  } else if (meanAlignment >= 0.55) {
    band = 'Some gaps';
  } else {
    band = 'Talk about this';
  }

  // Dealbreaker rule: any dealbreaker with alignment < 0.8 overrides the band
  if (hasDealbreakerConflict) {
    band = 'Talk about this';
    flags.push('Important to one of you');
  }

  return {
    pairId,
    topicId: topic.id,
    band,
    coverage,
    alignment: meanAlignment,
    dealbreakerConflict: hasDealbreakerConflict,
    flags,
  };
}

/**
 * Orders topics for the Compatibility Chart:
 * Talk about this first -> Some gaps -> Strong match -> Not answered yet
 */
export function sortTopicResults(results: ChartResult[]): ChartResult[] {
  const bandPriority: Record<CompatibilityBand, number> = {
    'Talk about this': 1,
    'Talk in person': 2,
    'Some gaps': 3,
    'Strong match': 4,
    'Not answered yet': 5,
  };

  return [...results].sort((a, b) => {
    const prioA = bandPriority[a.band] ?? 99;
    const prioB = bandPriority[b.band] ?? 99;
    if (prioA !== prioB) return prioA - prioB;
    // Secondary sort: lower alignment first
    return a.alignment - b.alignment;
  });
}

/**
 * Computes suggested conversational questions ("Ask what matters")
 * Ordered by: dealbreaker conflicts first, then (1 - alignment) * weight descending.
 * Returns up to top 3 items for "Next chai".
 */
export function generateAskItems(
  pairId: string,
  questions: Question[],
  answersA: Record<string, Answer>,
  answersB: Record<string, Answer>,
  optedInTopicIds?: Set<string>,
  existingAskItems?: Record<string, AskItem>
): { allItems: AskItem[]; topNextChai: AskItem[] } {
  const items: AskItem[] = [];

  for (const q of questions) {
    if (optedInTopicIds && !optedInTopicIds.has(q.topicId)) {
      continue;
    }

    const ansA = answersA[q.id];
    const ansB = answersB[q.id];

    // If both skipped, skip
    if (!ansA || !ansB || (ansA.skipped && ansB.skipped)) {
      continue;
    }

    const res = calculateQuestionAlignment(q, ansA, ansB);

    // If it's a perfect match with no dealbreaker, it's lower priority to ask
    const existing = existingAskItems?.[q.id];
    const status = existing?.status ?? 'suggested';

    items.push({
      pairId,
      questionId: q.id,
      suggestedText: q.suggestedAskText,
      tip: q.suggestedAskTip,
      gapScore: res.gapScore,
      dealbreakerConflict: res.dealbreakerConflict,
      status,
    });
  }

  // Sort: dealbreaker conflicts first, then highest gapScore
  items.sort((a, b) => {
    if (a.dealbreakerConflict && !b.dealbreakerConflict) return -1;
    if (!a.dealbreakerConflict && b.dealbreakerConflict) return 1;
    return b.gapScore - a.gapScore;
  });

  // Top 3 for "Next chai" suggestions
  const topNextChai = items.slice(0, 3);

  return { allItems: items, topNextChai };
}
