import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { SocketService } from './shared/services/socket.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, ToastModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  notificationSubscription: Subscription | null = null;
  userId = localStorage.getItem('userId') || 0;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      const id = Number(this.userId);

      this.listenForNotifications(id);
    }
  }

  listenForNotifications(userId: number) {
    this.notificationSubscription = this.socketService
      .listenForNotifications(userId)
      .subscribe((data: any) => {
        console.log('🔔 Socket notification received ✨', data);
        if (data?.message) {
          this.messageService.add({
            severity: 'info',
            summary: 'New Like',
            detail: `${data.message}`,
            // sticky: true,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
  }
}
