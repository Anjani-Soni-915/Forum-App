import { Component, Input, OnInit } from '@angular/core';
import { SubscriptionService } from '../../shared/services/subscription.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss'],
})
export class SubscriptionComponent implements OnInit {
  @Input() topicId!: number;
  @Input() subsStatus!: boolean;
  isSubscribed = false;

  constructor(private subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    if (!this.topicId) {
      console.error('Topic ID is required for subscription.');
      return;
    }

    this.isSubscribed = this.subsStatus;
  }

  toggleSubscription() {
    if (!this.topicId) {
      console.error('Cannot subscribe/unsubscribe without a topic ID.');
      return;
    }

    const input = { topicId: this.topicId };

    this.subscriptionService.createSubscription(input).subscribe(
      (response) => {
        this.isSubscribed = !this.isSubscribed;
        console.log(
          this.isSubscribed
            ? 'Subscribed successfully'
            : 'Unsubscribed successfully'
        );
      },
      (error) => {
        console.error('Subscription Error:', error);
      }
    );
  }
}
