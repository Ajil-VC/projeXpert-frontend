import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivityItem, ScheduleItem, SummaryCard } from '../../domain/dashboard.domain';
import { AuthService } from '../../../../../auth/data/auth.service';
import { DashboardService } from '../../data/dashboard.service';
import { NotificationService } from '../../../../../../core/data/notification.service';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Subject, takeUntil } from 'rxjs';
import { Task } from '../../../../../../core/domain/entities/task.model';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {


  summaryCards: SummaryCard[] = [
    {
      count: 0,
      label: 'Completed',
      sublabel: 'total completed tasks',
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      count: 0,
      label: 'Open Tasks',
      sublabel: 'tasks in progress',
      icon: 'fa-pencil-alt',
      color: 'blue'
    },
    {
      count: 0,
      label: 'Due Soon',
      sublabel: 'in the next 7 days',
      icon: 'fa-calendar-check',
      color: 'orange'
    },
    {
      count: 0,
      label: 'Overdue',
      sublabel: 'by the last 7 days',
      icon: 'fa-exclamation-circle',
      color: 'red'
    },
    {
      count: 0,
      label: 'Unsheduled',
      sublabel: 'Tasks to be planned',
      icon: 'fa-exclamation-circle',
      color: 'red'
    }

  ];

  epicItems: Task[] = [];

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

  constructor(private shared: SharedService, private authService: AuthService, private dashboardSer: DashboardService, private toast: NotificationService) { }

  private destroy$ = new Subject<void>();

  ngOnInit() {

    this.shared.currentPro$
      .pipe(takeUntil(this.destroy$))
      .subscribe((project) => {
        if (!project) {
          this.refreshDashboardView(null);
          return;
        }
        this.getData();
      })

    this.getData();

  }


  refreshDashboardView(res: any) {

    for (let card of this.summaryCards) {
      if (card.label === 'Completed') {
        card.count = res?.result?.completed?.length || 0;
      } else if (card.label === 'Open Tasks') {
        card.count = res?.result?.openTasks?.length || 0;
      } else if (card.label === 'Due Soon') {
        card.count = res?.result?.dueSoon?.length || 0;
      } else if (card.label === 'Overdue') {
        card.count = res?.result?.overdue?.length || 0;
      } else if (card.label === 'Unsheduled') {
        card.count = res?.result?.unscheduled?.length || 0;
      }
    }

    this.epicItems = res?.result?.epics || [];
  }

  getData() {

    this.dashboardSer.getProjectStats().subscribe({
      next: (res) => {

        this.refreshDashboardView(res);

      },
      error: (err) => {
        this.toast.showError('Couldnt initialize dashboard.');
      }
    })

  }


  viewEpics() {
    // Logic to view all epics
  }

  viewAllActivities() {
    // Logic to view all activities
  }

  viewAllSchedule() {
    // Logic to view all scheduled items
  }


  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
