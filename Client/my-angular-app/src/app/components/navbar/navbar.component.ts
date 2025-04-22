import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '../login/login.component';
import { SignupComponent } from '../signup/signup.component';
import { Router, RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { NotificationComponent } from '../notification/notification.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    LoginComponent,
    CommonModule,
    ReactiveFormsModule,
    SignupComponent,
    OverlayPanelModule,
    RouterModule,
    NotificationComponent,
  ],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  @ViewChild('notificationComp') notificationComponent!: NotificationComponent;
  isLoginModalOpen = false;
  isSignupModalOpen = false;
  isDropdownOpen = false;
  isLoggedIn = !!localStorage.getItem('accessToken');
  userName = localStorage.getItem('fName') || null;
  image = localStorage.getItem('image') || null;

  constructor(private route: Router, private messageService: MessageService) {}
  ngOnInit() {
    this.checkUserLoginStatus();
  }
  onNotificationPanelShow() {
    if (this.notificationComponent) {
      this.notificationComponent.getNotification();
    }
  }
  checkUserLoginStatus() {
    const token = localStorage.getItem('accessToken');

    if (token) {
      this.isLoggedIn = true;
      this.userName = localStorage.getItem('fName');
      this.image = localStorage.getItem('image');
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    localStorage.clear();
    this.isLoggedIn = false;
    this.isDropdownOpen = false;
    this.route.navigateByUrl('/');

    this.messageService.add({
      severity: 'success',
      summary: 'Logout successful!',
    });
  }

  // Open Signup Modal
  signupOpen() {
    this.isSignupModalOpen = true;
    this.isLoginModalOpen = false;
  }

  // Close Signup Modal
  signupClose() {
    this.isSignupModalOpen = false;
    this.checkUserLoginStatus();
  }

  // Open Login Modal
  openLoginModal() {
    this.isLoginModalOpen = true;

    this.isSignupModalOpen = false;
  }

  // Close Login Modal
  closeLoginModal() {
    this.isLoginModalOpen = false;
    this.checkUserLoginStatus();
  }

  // Switch from Signup to Login
  switchToLogin() {
    this.isSignupModalOpen = false;
    this.isLoginModalOpen = true;
  }

  // Switch from Login to Signup
  switchToSignup() {
    this.isLoginModalOpen = false;
    this.isSignupModalOpen = true;
  }
}
