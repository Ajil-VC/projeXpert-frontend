import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SubscriptionService } from './data/subscription.service';
import { NotificationService } from '../../../../core/data/notification.service';
import { Subscription } from '../../../../core/domain/entities/subscription.model';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule, FormsModule, LoaderComponent],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionComponent {

  isButtonDisabled: boolean = false;
  isSubscribed: boolean = false;
  subcriptionDetails!: Subscription;
  isLoading: boolean = true;

  constructor(private subSer: SubscriptionService, private toast: NotificationService) { }

  ngOnInit() {

    this.subSer.getSubscriptionDetails().subscribe({
      next: (res) => {

        if (res.status) {

          const subscription = res.result as Subscription;
          this.subcriptionDetails = subscription;
          if (this.subcriptionDetails.status === 'active') {
            this.isSubscribed = true;
          }

        }
        this.isLoading = false;
      },
      error: (err) => {
        this.toast.showInfo('It seems you havnt subscribed to any plan');
        this.isLoading = false;
      }
    })

  }

  plans = [
    {
      name: 'Pro',
      price: '₹499/month',
      description: 'Get access to essential project management tools to organize your tasks and collaborate with up to 3 team members.Includes 1 workspace, up to 3 projects, 10 team members',
      color: 'glass-blue',
      buttonText: 'Choose Pro',
      priceId: 'price_1Riy8cPTno59Z2O1dAO1TViC'
    },
    {
      name: 'Enterprise',
      price: '₹999/month',
      description: 'Ideal for large organizations needing full control, advanced security, and priority support. Get all Pro features plus unlimited workspaces, projects, and team members—along with custom integrations and a dedicated success team.',
      color: 'glass-green',
      buttonText: 'Choose Enterprise',
      priceId: 'price_1RiyBRPTno59Z2O1G5lvje4W'
    }
  ];

  subscribe(plan: any) {
    this.isButtonDisabled = true;
    this.subSer.checkout(plan.priceId).subscribe({
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
