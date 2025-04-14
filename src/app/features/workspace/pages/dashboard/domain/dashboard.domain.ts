export interface SummaryCard {
    count: number;
    label: string;
    sublabel: string;
    icon: string;
    color: string;
  }
  
  export interface EpicItem {
    id: string;
    title: string;
    status: string;
    progress: number;
  }
  
  export interface ActivityItem {
    id: string;
    user: {
      name: string;
      avatar: string;
      initials: string;
    };
    action: string;
    target: string;
    timestamp: string;
  }
  
  export interface ScheduleItem {
    id: string;
    title: string;
    time: string;
    duration: string;
    attendees: Array<{
      name: string;
      avatar: string;
      initials: string;
    }>;
  }
  