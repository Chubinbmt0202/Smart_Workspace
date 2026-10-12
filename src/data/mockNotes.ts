import type { NoteItem, NotificationItem } from '../types/note';

export const USER_PROFILE = {
  name: 'Daria Shynder',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  unreadNotifications: 2
};

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    dotColor: '#faa738', // Amber/orange dot
    title: 'Shooting with Nastya',
    date: '20.12.2020',
    subtitle: 'Meet neat the metro.'
  },
  {
    id: 'notif-2',
    dotColor: '#e040fb', // Magenta/pink dot
    title: 'Meeting with Josh',
    date: '10.12.2020',
    subtitle: 'To discuss project.'
  },
  {
    id: 'notif-3',
    dotColor: '#faa738', // Amber/orange dot
    title: 'Meeting with Alice',
    date: '20.11.2020',
    subtitle: 'Meet with lovely friend.',
    isOverdue: true
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: 'note-1',
    tag: 'Personal',
    tagType: 'personal',
    date: '12.10.2026',
    attachmentCount: 2,
    attachments: [
      { name: 'Photo_Shooting_Plan.pdf', size: '2.4 MB', type: 'application/pdf' },
      { name: 'Instagram_Moodboard.png', size: '4.8 MB', type: 'image/png' }
    ],
    title: 'Shooting with Nastya',
    content: "I need to meet with Nastya Gromko near the metro station Golder Gate. After this we'll go to Paul coffe shop and doing some photos for me instagram content.",
    avatars: [
      {
        name: 'Josh',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Nastya',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ],
    reminder: {
      time: '12.00',
      day: 'Today',
      isUrgent: true
    }
  },
  {
    id: 'note-biz-1',
    tag: 'Business',
    tagType: 'projects',
    date: '15.10.2026',
    attachmentCount: 3,
    attachments: [
      { name: 'Q4_Financial_Report.xlsx', size: '1.8 MB', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
      { name: 'Roadmap_Presentation.pdf', size: '5.2 MB', type: 'application/pdf' },
      { name: 'Budget_Overview.docx', size: '820 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }
    ],
    title: 'Q4 Budget & Strategy Review',
    content: 'Review quarterly revenue targets, product roadmap expenses, and staffing requirements with department heads.',
    avatars: [
      {
        name: 'Josh',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      }
    ],
    reminder: {
      time: '14.00',
      day: 'Thursday',
      isUrgent: false
    }
  },
  {
    id: 'note-2',
    tag: 'Projects',
    tagType: 'projects',
    date: '12.10.2026',
    attachmentCount: 2,
    attachments: [
      { name: 'Taxi_App_Concept_v1.pdf', size: '3.6 MB', type: 'application/pdf' },
      { name: 'User_Flow_Diagram.png', size: '2.1 MB', type: 'image/png' }
    ],
    title: 'Create concept for Taxi app',
    content: 'I got a new progect, application for Taxi. For first I need to do a research and concept for this project. For start i need to write a little technical task for better understanding this application.',
    avatars: [
      {
        name: 'Josh',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Nastya',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ],
    moreAvatarsCount: 5,
    reminder: undefined
  },
  {
    id: 'note-3',
    tag: 'Personal',
    tagType: 'personal',
    date: '08.10.2026',
    attachmentCount: 2,
    attachments: [
      { name: 'Meeting_Agenda.docx', size: '450 KB', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' },
      { name: 'Design_Proposal.pdf', size: '1.9 MB', type: 'application/pdf' }
    ],
    title: 'Meeting with Josh',
    content: 'To discuss project details and milestones for next quarter. Coordinate with design team and prepare presentations.',
    avatars: [
      {
        name: 'Josh',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      }
    ],
    reminder: {
      time: '12.00',
      day: 'Monday',
      isUrgent: false
    }
  },
  {
    id: 'note-4',
    tag: 'Projects',
    tagType: 'projects',
    date: '20.10.2026',
    title: 'Finish design for Seam site',
    content: 'I need to finish design for studio of interior design. And sent a last version. After this i need to send it for Front end Developers for watching this project.',
    avatars: [
      {
        name: 'Josh',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80'
      },
      {
        name: 'Nastya',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80'
      }
    ],
    moreAvatarsCount: 5,
    reminder: undefined
  },
  {
    id: 'note-5',
    tag: 'Add Tag',
    tagType: 'custom',
    date: '25.10.2026',
    attachmentCount: 2,
    title: 'My thoughts for today',
    content: "All time we need to have a dream. If you haven't dream you haven't goal. And therefore your life will be empty and not full of meaning. That is why don't afraid dreaming.",
    avatars: [
      {
        name: 'Author',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
        hasGoldRing: true
      }
    ],
    reminder: {
      time: '12.00',
      day: 'Sunday',
      isUrgent: false
    }
  },
  {
    id: 'note-6',
    tag: 'Personal',
    tagType: 'personal',
    date: '28.10.2026',
    title: 'Meeting with Alice',
    content: 'I have interesting project for Josh. And we need to meet for discuss all details of this project. Maybe in future he will have work with this project with me.',
    avatars: [],
    reminder: {
      time: '12.00',
      day: 'Friday',
      isUrgent: false
    }
  }
];
