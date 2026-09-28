import { Topic } from '../types';

export const TOPICS: Topic[] = [
  {
    id: 'family',
    name: 'Family & living',
    sensitive: false,
    order: 1,
    description: 'Joint vs nuclear family, parents’ say in decisions, where to live, caring for parents',
  },
  {
    id: 'money',
    name: 'Money, loans & debt',
    sensitive: false,
    order: 2,
    description: 'Existing loans or debt, spending vs saving, who manages money, family financial obligations',
  },
  {
    id: 'children',
    name: 'Children',
    sensitive: false,
    order: 3,
    description: 'Whether, how many, when, parenting roles and expectations',
  },
  {
    id: 'everyday',
    name: 'Everyday life',
    sensitive: false,
    order: 4,
    description: 'Work and ambition, household chores, time alone, social life, religion and rituals',
  },
  {
    id: 'past',
    name: 'Past relationships',
    sensitive: true, // Sensitive opt-in
    order: 5,
    description: 'Previous relationships, closure, expectations around exes and boundaries',
    gateTitle: 'A thoughtful conversation.',
    gateBody: 'Past relationships can feel delicate to bring up. Share what you feel comfortable sharing, at your own pace.',
  },
  {
    id: 'intimacy',
    name: 'Intimacy & desire',
    sensitive: true,
    order: 6,
    description: 'Physical closeness, early marriage expectations, exploring together, boundaries',
    gateTitle: 'This section is frank, but discreet.',
    gateBody: 'We ask directly about closeness and comfort. Specifics never go in forms, only what you choose to share in private notes.',
  },
  {
    id: 'mental_health',
    name: 'Mental health',
    sensitive: true,
    order: 7,
    description: 'Past or current struggles, emotional support, therapy, what helps on a hard day',
    gateTitle: 'This section is heavier.',
    gateBody: 'Answer only what you are ready to. You can come back to it later.',
  },
  {
    id: 'trauma',
    name: 'Trauma & the past',
    sensitive: true,
    order: 8,
    description: 'Whether there is something from your journey you would want them to know before marriage',
    gateTitle: 'You control the pace completely.',
    gateBody: 'Details are never asked. If there is something you carry, you choose if, when, and how you want to share it.',
  },
];
