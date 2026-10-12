import type { TagItem } from '../types/tag';

export const INITIAL_TAGS: TagItem[] = [
  { id: 'personal', label: 'Personal', dotColor: '#3b82f6' },
  { id: 'projects', label: 'Projects', dotColor: '#f59e0b' },
  { id: 'business', label: 'Business', dotColor: '#ef4444' }
];

export const TAG_COLOR_PALETTE = [
  '#10b981', // emerald
  '#06b6d4', // cyan
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#f97316', // orange
  '#14b8a6', // teal
  '#6366f1'  // indigo
];
