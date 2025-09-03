import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';
import { ConfirmDialogComponent } from '../../../reusable/confirm-dialog/confirm-dialog.component';
import { PlanCreationModalComponent } from './plan-creation-modal/plan-creation-modal.component';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { PaginationComponent } from '../../../reusable/pagination/pagination.component';

@Component({
  selector: 'app-create-plan',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContentHeaderComponent, PaginationComponent],
  templateUrl: './create-plan.component.html',
  styleUrl: './create-plan.component.css'
})
export class CreatePlanComponent {

  headerConfig: HeaderConfig = {

    title: 'Subscription Plans',
    icon: '🛠️',
    subtitle: 'Manage your product plans and pricing',
    placeHolder: 'Search plans...',
    searchQuery: '',
    buttons: [
      {
        type: 'main',
        label: '+ Create Plan',
      },
      { type: 'view' }
    ]

  }

  currentPage: number = 1;
  totalPages: number = 1;

  handleSearchEvent(event: string) {

    this.searchTerm = event;
    this.loadSubscriptions(1)

  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {
        this.openCreatePlanDialog();
      } else if (btn.type === 'filter') {
        if (btn.action && 'statusFilters' in btn.action) {
          // this.toggleStatusFilter(btn.action.statusFilters)
        }
      } else if (btn.type === 'view') {
        if (btn.action && 'viewMode' in btn.action && btn.action.viewMode) {
          this.viewMode = btn.action.viewMode;
        }
      }
    }
  }


  subscriptions: SubscriptionPlan[] = [];

  searchTerm = '';
  sortField: keyof SubscriptionPlan = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = false;
  viewMode = 'grid';


  constructor(
    private service: AdminService,
    private dialog: MatDialog,
    private toast: NotificationService
  ) { }

  ngOnInit(): void {
    this.loadSubscriptions(this.currentPage);
  }

  loadSubscriptions(page: number): void {
    this.isLoading = true;
    this.service.getAvailablePlans(page, this.searchTerm).subscribe({
      next: (res) => {

        this.isLoading = false;
        this.subscriptions = res.result.plans || [];
        this.totalPages = res.result.totalPage || 1;

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching subscription plans', err);
      }
    });
  }



  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSubscriptions(page);
  }


  onToggleChange(event: any, plan: SubscriptionPlan) {
    event.stopPropagation();
    this.service.changePlanStatus(plan._id).subscribe();
  }


  openCreatePlanDialog(): void {


    const dialogRef = this.dialog.open(PlanCreationModalComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.service.createSubscriptionPlan(
          result.billingCycle,
          result.description,
          result.name,
          result.price,
          result.maxWorkspace,
          result.maxProjects,
          result.maxMembers,
          result.canUseVideoCall
        ).subscribe({
          next: (res) => {
            if (!res.status) throw new Error('Projects couldnt retrieve after updation');

            this.subscriptions.push(res.result);

          },
          error: (err) => {
            console.error('Error occured while updating project.', err);
          }
        })


      }
    });

  }




  deletePlan(event: Event, plan: SubscriptionPlan): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Plan',
        message: `Are you sure you want to delete "${plan.name}"?`,
        confirmButton: 'Delete',
        cancelButton: 'Cancel'
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        this.service.deletePlan(plan._id).subscribe();
        const planIndex = this.subscriptions.findIndex(result => result._id === plan._id);
        this.subscriptions.splice(planIndex, 1);

      }
    });
  }

}
