import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { Subscription } from 'rxjs';
import { SocketService } from './shared/services/socket.service';
import { MessageService } from 'primeng/api';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    ToastModule,
    CommonModule,
    NavbarComponent,
    SidebarComponent,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  notificationSubscription: Subscription | null = null;
  subscriptionNotification: Subscription | null = null;
  userId = localStorage.getItem('userId') || 0;

  constructor(
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit(): void {
    if (this.userId) {
      const id = Number(this.userId);

      this.listenForLikes(id);
      this.listenForSubscriptions(id);
    }
  }

  listenForLikes(userId: number) {
    this.notificationSubscription = this.socketService
      .listenForNotifications(userId)
      .subscribe((data: any) => {
        console.log('🔔 Like notification received ✨', data);
        if (data?.message) {
          console.log('data->>>', data?.message);
          this.messageService.add({
            severity: 'info',
            summary: `${data?.message}`,
            detail: `${data?.title}`,
            icon: 'pi pi-bell',
            sticky: true,
          });
        }
      });
  }

  listenForSubscriptions(userId: number) {
    this.subscriptionNotification = this.socketService
      .listenForSubscriptionNotifications(userId)
      .subscribe((data: any) => {
        console.log('📩 Subscription notification received ✨', data);
        if (data) {
          console.log(data?.message);
          this.messageService.add({
            severity: 'info',
            summary: `${data?.message}`,
            detail: `${data?.title}`,
            icon: 'pi pi-bell',
            sticky: true,
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.notificationSubscription?.unsubscribe();
    this.subscriptionNotification?.unsubscribe();
  }
}
