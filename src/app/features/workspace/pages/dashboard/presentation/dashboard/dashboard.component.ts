import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivityItem, EpicItem, ScheduleItem, SummaryCard } from '../../domain/dashboard.domain';
import { AuthService } from '../../../../../auth/data/auth.service';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  summaryCards: SummaryCard[] = [
    {
      count: 8,
      label: 'completed',
      sublabel: 'tasks over 7 days',
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      count: 10,
      label: 'updated',
      sublabel: 'tasks over 7 days',
      icon: 'fa-pencil-alt',
      color: 'blue'
    },
    {
      count: 1,
      label: 'due soon',
      sublabel: 'in the next 7 days',
      icon: 'fa-calendar-check',
      color: 'orange'
    },
    {
      count: 0,
      label: 'overdue',
      sublabel: 'by the last 7 days',
      icon: 'fa-exclamation-circle',
      color: 'red'
    }
  ];

  epicItems: EpicItem[] = [
    {
      id: 'SCRUM-13',
      title: 'Wishlist Management',
      status: 'In progress',
      progress: 70
    },
    {
      id: 'SCRUM-11',
      title: 'Product Management',
      status: 'In progress',
      progress: 85
    }
  ];

  activityItems: ActivityItem[] = [
    {
      id: '1',
      user: {
        name: 'Don Bold',
        avatar: 'assets/avatars/don.jpg',
        initials: 'DB'
      },
      action: 'changed the Status from To Do to Done on',
      target: 'Order Management',
      timestamp: 'about 1 hour ago'
    },
    {
      id: '2',
      user: {
        name: 'Don Bold',
        avatar: 'assets/avatars/don.jpg',
        initials: 'DB'
      },
      action: 'changed the Status from To Do to Done on',
      target: 'User Roles',
      timestamp: 'about 2 hours ago'
    },
    {
      id: '3',
      user: {
        name: 'Claire Di',
        avatar: 'assets/avatars/claire.jpg',
        initials: 'CD'
      },
      action: 'changed the Assignee to',
      target: 'Don Bold',
      timestamp: 'about 2 hours ago'
    }
  ];

  scheduleItems: ScheduleItem[] = [
    {
      id: '1',
      title: 'Kickoff meeting',
      time: '1 Hour 45 Minutes',
      duration: '45m',
      attendees: [
        { name: 'User 1', avatar: 'assets/avatars/user1.jpg', initials: 'U1' },
        { name: 'User 2', avatar: 'assets/avatars/user2.jpg', initials: 'U2' },
        { name: 'User 3', avatar: 'assets/avatars/user3.jpg', initials: 'U3' }
      ]
    },
    {
      id: '2',
      title: 'Create WordPress website for event Registration',
      time: '1 Hour 45 Minutes',
      duration: '1h 45m',
      attendees: [
        { name: 'User 1', avatar: 'assets/avatars/user1.jpg', initials: 'U1' },
        { name: 'User 4', avatar: 'assets/avatars/user4.jpg', initials: 'U4' }
      ]
    }
  ];

  constructor(private authService: AuthService) { }


  viewEpics() {
    // Logic to view all epics
  }

  viewAllActivities() {
    // Logic to view all activities
  }

  viewAllSchedule() {
    // Logic to view all scheduled items
  }

}
