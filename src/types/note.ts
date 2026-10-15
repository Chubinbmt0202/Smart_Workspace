import type { NoteAttachment } from '../utils/attachment';

export interface NoteItem {
  id: string;
  tag: string;
  tagType: 'personal' | 'projects' | 'custom';
  date: string;
  attachmentCount?: number;
  attachments?: NoteAttachment[];
  title: string;
  content: string;
  day_notice?: string | null;
  avatars?: {
    name: string;
    avatarUrl: string;
    hasGoldRing?: boolean;
  }[];
  moreAvatarsCount?: number;
  reminder?: {
    time: string;
    day: string;
    isUrgent?: boolean;
  };
  deletedAt?: string;
  trashId?: string;
}

export interface NotificationItem {
  id: string;
  dotColor: string;
  title: string;
  date: string;
  subtitle: string;
  isOverdue?: boolean;
}

export interface UserProfile {
  name: string;
  avatarUrl: string;
  unreadNotifications: number;
}
