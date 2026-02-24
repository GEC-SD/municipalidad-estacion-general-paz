import { Status } from './global';

export type EventCategory = 'cultural' | 'deportivo' | 'institucional' | 'educativo' | 'social';

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  event_date: string;
  event_time?: string;
  end_date?: string;
  location?: string;
  category: EventCategory;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  organizer?: string;
  contact_info?: string;
  created_at: string;
  updated_at: string;
};

export type EventFormData = {
  title: string;
  slug: string;
  description: string;
  event_date: string;
  event_time?: string;
  end_date?: string;
  location?: string;
  category: EventCategory;
  image_url?: string;
  is_featured: boolean;
  is_active: boolean;
  organizer?: string;
  contact_info?: string;
};

export type EventPagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type EventFilters = {
  category?: EventCategory;
  search?: string;
  upcoming?: boolean;
};

export type EventsSlice = {
  events: Event[];
  featuredEvents: Event[];
  upcomingEvents: Event[];
  monthEvents: Event[];
  currentEvent: Event | null;
  pagination: EventPagination;
  filters: EventFilters;
  lastFetched: Record<string, number>;
  status: {
    [key: string]: Status;
  };
};
