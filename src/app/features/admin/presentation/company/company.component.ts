import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Company } from '../../../../core/domain/entities/company.model';
import { User } from '../../../../core/domain/entities/user.model';
import { MatDialog } from '@angular/material/dialog';
import { EditCompanyModalComponent } from './edit-company-modal/edit-company-modal.component';

@Component({
  selector: 'app-company',
  imports: [CommonModule, FormsModule],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent {

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

  openCreateCompanyDialog() {

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
  search(event: any) {

    this.searchTerm = event.target.value;
    this.fileteredCompanies();

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
