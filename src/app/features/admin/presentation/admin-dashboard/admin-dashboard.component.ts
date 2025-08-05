import { Component } from '@angular/core';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { CommonModule } from '@angular/common';
import { SummaryCard } from '../../../workspace/pages/dashboard/domain/dashboard.domain';

@Component({
  selector: 'app-admin-dashboard',
  imports: [CommonModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  constructor(private adminSer: AdminService, private toast: NotificationService) { }

  ngOnInit() {

    this.adminSer.getDashBoardData().subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        this.toast.showError('Couldnt retrieve dash board data.')
      }
    })
  };


  summaryCards: SummaryCard[] = [
    {
      count: 0,
      label: 'Total Companies',
      sublabel: '.......',
      icon: 'fa-check-circle',
      color: 'green'
    },
    {
      count: 0,
      label: 'Active Subscriptions',
      sublabel: '......',
      icon: 'fa-pencil-alt',
      color: 'blue'
    },
    {
      count: 0,
      label: 'Monthly Revenue',
      sublabel: '........',
      icon: 'fa-calendar-check',
      color: 'orange'
    }

  ];



}
