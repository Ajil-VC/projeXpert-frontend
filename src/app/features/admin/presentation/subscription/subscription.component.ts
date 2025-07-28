import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AdminService } from '../../data/admin.service';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionDetailComponent {

  subscribedCompanies: any[] = [];

  constructor(private adminSer: AdminService) { }
  ngOnInit() {

    this.adminSer.getSubscriptionDetails().subscribe({
      next: (res: { status: true, result: SubscriptionPlan[] }) => {
        console.log(res);
        this.subscribedCompanies = res.result;
      }
    })

  }

  isExpired(date: any) {

    if(!date){
      return 'Nill';
    }
    const endDate = new Date(date);
    const currentDate = new Date();
    if (endDate < currentDate) {
      return 'Expired';
    }
    return this.toMediumDateFormat(endDate)
  }

  toMediumDateFormat(date :Date) {
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  return formatter.format(date);
}

}
