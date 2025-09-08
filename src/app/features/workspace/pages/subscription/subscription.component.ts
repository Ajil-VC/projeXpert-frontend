import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from './data/subscription.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { SubscriptionPlan } from '../../../../core/domain/entities/subscription.model';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';
import { Company } from '../../../../core/domain/entities/company.model';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  isButtonDisabled: boolean = false;
  isSubscribed: boolean = false;
  companySubscription!: Company;
  isLoading: boolean = true;

  currentPage = 1;
  totalPages = 1;
  plans: SubscriptionPlan[] = [];

  constructor(private subSer: SubscriptionService, private toast: NotificationService) { }

  ngOnInit() {
    this.loadSubscription();
  }

  loadSubscription(page: number = 1): void {
    this.isLoading = true;
    this.subSer.getSubscriptionDetails(page).subscribe({
      next: (res) => {

        if (res.status) {
          this.companySubscription = res.result;
          this.isSubscribed = true;

        } else {
          this.plans = res?.plans?.plans || [];
        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.showInfo('It seems you havnt subscribed to any plan');
        this.isLoading = false;
      }
    })

  }

  subscribe(plan: SubscriptionPlan) {
    this.isButtonDisabled = true;
    this.subSer.checkout(plan.stripePriceId).subscribe({
      next: (res: any) => {
        if (res.url) {
          window.location.href = res.url

        } else {
          this.toast.showError('Something went wrong during subscription.');
          this.isButtonDisabled = false;
        }
      },
      error: (err) => {
        this.toast.showError('Something went wrong during subscription.');
        this.isButtonDisabled = false;
      }
    })
  }

}
