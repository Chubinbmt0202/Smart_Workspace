export interface NoteItem {
  id: string;
  tag: string;
  tagType: 'personal' | 'projects' | 'custom';
  date: string;
  attachmentCount?: number;
  title: string;
  content: string;
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
