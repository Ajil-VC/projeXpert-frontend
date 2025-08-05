import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';
import { ConfirmDialogComponent } from '../../../workspace/pages/projects/presentation/modal/confirm-dialog/confirm-dialog.component';
import { PlanCreationModalComponent } from './plan-creation-modal/plan-creation-modal.component';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';

@Component({
  selector: 'app-create-plan',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ContentHeaderComponent],
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

  handleSearchEvent(event: string) {

    this.searchTerm = event;
    this.applyFilters();

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
  filteredSubscriptions: SubscriptionPlan[] = [];

  searchTerm = '';
  sortField: keyof SubscriptionPlan = 'name';
  sortDirection: 'asc' | 'desc' = 'asc';
  isLoading = false;
  viewMode = 'grid';

  currentPage = 1;
  totalPages = 1;

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
    this.service.getAvailablePlans(page).subscribe({
      next: (res) => {

        this.isLoading = false;
        this.subscriptions = res.result.plans || [];
        this.totalPages = res.result.totalPages || 1;
        this.applyFilters();
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching subscription plans', err);
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.subscriptions];

    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(plan =>
        plan.name.toLowerCase().includes(term)
      );
    }

    this.filteredSubscriptions = filtered;
  }

  search(event: any): void {
    this.searchTerm = event.target.value;
    this.applyFilters();
  }

  setSortField(field: keyof SubscriptionPlan): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }
    this.applyFilters();
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadSubscriptions(page);
  }


  onToggleChange(event: any, plan: SubscriptionPlan) {
    event.stopPropagation();
    this.service.changePlanStatus(plan._id).subscribe({
      next: (res) => {
        console.log(res)
      },
      error: (err) => {
        this.toast.showError('Couldnt change the status');
      }
    })
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
            this.applyFilters();
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

        this.service.deletePlan(plan._id).subscribe({
          next: () => {
          },
          error: (err) => {
            this.toast.showError('Error deleting plan');
          }
        });

      }
    });
  }

}
