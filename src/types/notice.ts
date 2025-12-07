export type NoticeCategory = 'announcement' | 'update' | 'event';

export type Notice = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  createdAt: string;
  category?: NoticeCategory;
  featured?: boolean;
};


