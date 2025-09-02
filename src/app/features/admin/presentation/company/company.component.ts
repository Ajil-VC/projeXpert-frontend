import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../../core/domain/entities/company.model';
import { User } from '../../../../core/domain/entities/user.model';
import { MatDialog } from '@angular/material/dialog';
import { EditCompanyModalComponent } from './edit-company-modal/edit-company-modal.component';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { PaginationComponent } from '../../../reusable/pagination/pagination.component';
import { AdminService } from '../../data/admin.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-company',
  imports: [CommonModule, FormsModule, ContentHeaderComponent, PaginationComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

  private $destroy = new Subject<void>();
  headerConfig: HeaderConfig = {

    title: 'Companies',
    icon: '🏛️',
    subtitle: 'Manage all your companies from one place',
    placeHolder: 'Search companies...',
    searchQuery: '',
    buttons: [
      { type: 'view' }
    ]

  }

  handleSearchEvent(event: string) {

    this.searchTerm = event;
    this.loadCompanyData(1, this.searchTerm);

  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {

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

  currentPage: number = 1;
  totalPages: number = 1;

  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;
  companyDataRetrieved: Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [] = [];
  companyData: Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [] = [];
  sortField = 'name';
  sortDirection = 'asc';
  searchTerm: string = '';

  constructor(private route: ActivatedRoute, private adminSer: AdminService, private toast: NotificationService,
    public dialog: MatDialog) { }

  ngOnInit() {

    const companyData = this.route.snapshot.data['companyData'];

    this.loadCompanyData();

    if (companyData.status) {
      this.companyDataRetrieved = companyData.result as Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [];
    }

  }

  onPageChange(event: any) {
    this.currentPage = event;
    this.loadCompanyData(event);
  }

  loadCompanyData(page: number = 1, searchTerm: string = '') {

    this.adminSer.getCompleteCompanyDetails(page, searchTerm).pipe(takeUntil(this.$destroy))
      .subscribe({
        next: (res) => {

          this.companyData = res.companyData;
          this.totalPages = res.totalPages;
        },
        error: (err) => {
          this.toast.showError('Couldnt retrieve data.');
        }
      })
  }

  openCompany(company: any) { }

  editCompany(event: Event, company: any): void {

    event.stopPropagation();
    const dialogRef = this.dialog.open(EditCompanyModalComponent, {
      width: '500px',
      data: { ...company }//Hre current company should be sent.
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        //UUpdate data here.

      }
    });

  }

  deleteCompany(event: any, company: any) { }

  setSortField(name: any) { }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
