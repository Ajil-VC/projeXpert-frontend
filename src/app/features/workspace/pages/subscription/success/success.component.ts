import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubscriptionService } from '../data/subscription.service';
import { CommonModule, TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-success',
  imports: [TitleCasePipe, CommonModule],
  templateUrl: './success.component.html',
  styleUrl: './success.component.css'
})
export class SuccessComponent {

  sessionId: string = '';
  planName: string = '';
  billingCycle: string = '';
  isLoading = true;
  header: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private subService: SubscriptionService) { }

  ngOnInit(): void {
    this.sessionId = this.route.snapshot.queryParamMap.get('session_id') || '';

    if (this.sessionId) {
      this.subService.getSessionDetails(this.sessionId).subscribe({
        next: (res) => {
          this.planName = res.plan;
          this.billingCycle = res.billingCycle;   
          this.isLoading = false;
          this.header = '🎉 Subscription Successful!';
          this.message = 'You’ve successfully subscribed to the';
        },
        error: () => {
          this.planName = 'Unknown';
          this.isLoading = false;
        }
      });
    }
  }

}
