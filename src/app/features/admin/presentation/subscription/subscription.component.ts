import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AdminService } from '../../data/admin.service';
import { Subscription } from '../../../../core/domain/entities/subscription.model';

@Component({
  selector: 'app-subscription',
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrl: './subscription.component.css'
})
export class SubscriptionDetailComponent {

  subscriptions: any[] = [];

  constructor(private adminSer: AdminService) { }
  ngOnInit() {

    this.adminSer.getSubscriptionDetails().subscribe({
      next: (res: { status: true, result: Subscription[] }) => {
        console.log(res);
        this.subscriptions = res.result;
      }
    })

  }
}
