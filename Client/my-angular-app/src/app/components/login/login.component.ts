import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../shared/services/authentication.service';
import { Router } from '@angular/router';
import {
  CreateUserInput,
  CreateUserResponse,
} from '../../shared/interface/authentication.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() opensignup = new EventEmitter<void>();
  loginForm: FormGroup;
  isSignupModalOpen = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  closeModal() {
    this.close.emit();
  }

  onLogin() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (res: CreateUserResponse) => {
          if (res.user && res.tokens) {
            localStorage.setItem('userId', res.user.id);
            localStorage.setItem('fName', res.user.fName);
            localStorage.setItem('lName', res.user.lName);
            localStorage.setItem('image', res.user.image);
            localStorage.setItem('accessToken', res.tokens.accessToken);
            localStorage.setItem('refreshToken', res.tokens.refreshToken);
            // alert('Login Successful!');

            this.messageService.add({
              severity: 'success',
              summary: 'Login successful!',
            });

            this.closeModal();
            this.router.navigateByUrl('');
            //   setTimeout(() => {
            //     window.location.reload();
            //   }, 100);
          }
        },
        error: (error) => {
          console.error('Login Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Invalid credentials, please try again.',
          });
        },
      });
    }
  }

  openSignupModal() {
    this.closeModal();
    this.isSignupModalOpen = true;
    this.opensignup.emit();
  }

  closeSignupModal() {
    this.isSignupModalOpen = false;
  }
}

// import { CommonModule } from '@angular/common';
// import { Component, EventEmitter, Output } from '@angular/core';
// import {
//   FormBuilder,
//   FormGroup,
//   ReactiveFormsModule,
//   Validators,
// } from '@angular/forms';
// import { SignupComponent } from '../signup/signup.component';

// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss'],
// })
// export class LoginComponent {
//   @Output() close = new EventEmitter<void>();
//   @Output() opensignup = new EventEmitter<void>();
//   loginForm: FormGroup;
//   isSignupModalOpen = false;

//   constructor(private fb: FormBuilder) {
//     this.loginForm = this.fb.group({
//       email: ['', [Validators.required, Validators.email]],
//       password: ['', [Validators.required, Validators.minLength(6)]],
//     });
//   }

//   closeModal() {
//     this.close.emit();
//   }

//   onLogin() {
//     if (this.loginForm.valid) {
//       console.log('Login Success:', this.loginForm.value);
//       alert('Login Successful!');
//       this.closeModal();
//     }
//   }

//   openSignupModal() {
//     this.closeModal();
//     this.isSignupModalOpen = true;
//     this.opensignup.emit();
//   }

//   closeSignupModal() {
//     this.isSignupModalOpen = false;
//   }
// }
