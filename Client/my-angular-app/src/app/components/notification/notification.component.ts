import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import {
  NotificationInfo,
  UpdateNotificationInfoInput,
} from '../../shared/interface/notification.interface';
import { NotificationService } from '../../shared/services/notification.service';
import { TimeAgoPipe } from '../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule, OverlayPanelModule, TimeAgoPipe],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
})
export class NotificationComponent implements OnInit {
  notificationData: NotificationInfo[] = [];
  loading = false;
  error: string | null = null;
  isOpenState: { [key: number]: boolean } = {};
  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    this.getNotification();
  }

  getNotification() {
    this.loading = true;
    this.notificationService.fetchNotification().subscribe({
      next: (response: NotificationInfo[]) => {
        console.log('Fetched Notifications:', response);
        this.notificationData = response;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching notifications:', err);
        this.error = 'Failed to load notifications. Please try again.';
        this.loading = false;
      },
    });
  }

  openBox(notificationId: number) {
    console.log('id--------->>>', notificationId);
    this.isOpenState[notificationId] = !this.isOpenState[notificationId];
  }

  Update_isRead(notification: NotificationInfo) {
    const input: UpdateNotificationInfoInput = { isRead: true };

    this.notificationService
      .UpdateReadstatus(notification.id, input)
      .subscribe({
        next: (response) => {
          console.log('Notification updated successfully:', response);
          notification.isRead = true;
        },
        error: (err) => {
          console.error('Error updating notification:', err);
        },
      });
  }
}
