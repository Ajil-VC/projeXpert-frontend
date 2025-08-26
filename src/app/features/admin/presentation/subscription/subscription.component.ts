import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AdminService } from '../../data/admin.service';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { Subject, takeUntil } from 'rxjs';
import { PaginationComponent } from '../../../reusable/pagination/pagination.component';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, ContentHeaderComponent, PaginationComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionDetailComponent {

  subscribedCompanies: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  totalPages: number = 1;
  sort: 1 | -1 = 1;

  private $destroy = new Subject<void>();

  headerConfig: HeaderConfig = {

    title: 'Subscriptions',
    icon: '🛠️',
    subtitle: 'See all the subscription history',
    placeHolder: 'Search company, plan...',
    searchQuery: '',
    buttons: [

    ]

  }
  handleSearchEvent(event: string) {

    this.currentPage = 1;
    this.searchTerm = event;
    this.applyFilters();

  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {
        // this.openCreatePlanDialog();
      } else if (btn.type === 'filter') {
        if (btn.action && 'statusFilters' in btn.action) {
          // this.toggleStatusFilter(btn.action.statusFilters)
        }
      } else if (btn.type === 'view') {
        if (btn.action && 'viewMode' in btn.action && btn.action.viewMode) {
          // this.viewMode = btn.action.viewMode;
        }
      }
    }
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.applyFilters();
  }


  constructor(private adminSer: AdminService) { }
  ngOnInit() {

    this.applyFilters();
  }

  applyFilters() {
    this.adminSer.getSubscriptionDetails(this.searchTerm, this.sort, this.currentPage)
      .pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {

          if (res.status) {
            this.subscribedCompanies = res.result.subscriptions;
            this.totalPages = res.result.totalPage;
          }

        }
      })

  }

  isExpired(date: any) {

    if (!date) {
      return 'Nill';
    }
    const endDate = new Date(date);
    const currentDate = new Date();
    if (endDate < currentDate) {
      return 'Expired';
    }
    return this.toMediumDateFormat(endDate)
  }

  toMediumDateFormat(date: Date) {
    const formatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    return formatter.format(date);
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

}
