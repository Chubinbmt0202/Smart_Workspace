export const DEFAULT_CATEGORY_TABS = ['All', 'Personal', 'Projects', 'Business'] as const;

export type CategoryTab = (typeof DEFAULT_CATEGORY_TABS)[number];
