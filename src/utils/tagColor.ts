import type { TagItem } from '../types/tag';

export type TagColorClass =
  | 'tag-personal'
  | 'tag-projects'
  | 'tag-business'
  | 'tag-custom';

export function getTagColorClass(tag?: string): TagColorClass {
  switch (tag?.trim().toLowerCase()) {
    case 'personal':
      return 'tag-personal';
    case 'projects':
      return 'tag-projects';
    case 'business':
      return 'tag-business';
    default:
      return 'tag-custom';
  }
}

export function getTagColor(
  tagName: string | undefined,
  tags: readonly TagItem[]
): string | undefined {
  const normalizedName = tagName?.trim().toLowerCase();
  if (!normalizedName) return undefined;

  return tags.find((tag) => tag.label.trim().toLowerCase() === normalizedName)?.dotColor;
}
