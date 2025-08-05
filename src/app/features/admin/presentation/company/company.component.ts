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

@Component({
  selector: 'app-company',
  imports: [CommonModule, FormsModule, ContentHeaderComponent],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {


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
    this.fileteredCompanies();

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


  viewMode: 'grid' | 'list' = 'grid';
  isLoading = false;
  companyDataRetrieved: Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [] = [];
  companyData: Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [] = [];
  sortField = 'name';
  sortDirection = 'asc';
  searchTerm: string = '';

  constructor(private route: ActivatedRoute,
    public dialog: MatDialog) { }

  ngOnInit() {

    const companyData = this.route.snapshot.data['companyData'];
    if (companyData.status) {
      this.companyDataRetrieved = companyData.result as Array<{ companyDetails: Company, companyId: string, users: Array<User> }> | [];
      this.fileteredCompanies();
    }

  }

  fileteredCompanies() {

    this.companyData = this.companyDataRetrieved;
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      this.companyData = this.companyDataRetrieved.filter(company =>
        company.companyDetails.name.toLowerCase().includes(term)
      );
    }
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
        console.log(result);
      }
    });

  }

  deleteCompany(event: any, company: any) { }

  setSortField(name: any) { }
}
