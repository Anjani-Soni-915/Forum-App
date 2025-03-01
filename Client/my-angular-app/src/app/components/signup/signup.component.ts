import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CreateUserResponse } from '../../shared/interface/authentication.interface';
import { AuthService } from '../../shared/services/authentication.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  @Output() close = new EventEmitter<void>();
  @Output() isopenLogin = new EventEmitter<void>();
  signupForm: FormGroup;
  avatars: string[] = [];
  selectedAvatar: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private messageService: MessageService
  ) {
    this.signupForm = this.fb.group({
      fName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      lName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      email: ['', [Validators.required, Validators.email]],
      dob: ['', [Validators.required]],
      profession: ['', [Validators.required]],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(20),
        ],
      ],
      image: ['', Validators.required], // Stores selected avatar URL
    });

    this.generateAvatars();
  }

  generateAvatars() {
    this.avatars = [
      `https://avatar.iran.liara.run/public/63`,
      `https://avatar.iran.liara.run/public/100`,
      `https://avatar.iran.liara.run/public/35`,
      `https://avatar.iran.liara.run/public/62`,
      `https://avatar.iran.liara.run/public/15`,
      `https://avatar.iran.liara.run/public/45`,
      `https://avatar.iran.liara.run/public/6`,
      `https://avatar.iran.liara.run/public/60`,
    ];
  }
  defaultAvatar =
    'https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg';
  selectAvatar(avatarUrl: string) {
    this.selectedAvatar = avatarUrl;
    this.signupForm.patchValue({ image: avatarUrl });
  }
  signUp() {
    if (this.signupForm.valid) {
      const signUpdata = this.signupForm.value;

      this.authService.createUser(signUpdata).subscribe({
        next: (res: CreateUserResponse) => {
          if (res.user && res.tokens) {
            localStorage.setItem('userId', res.user.id);
            localStorage.setItem('fName', res.user.fName);
            localStorage.setItem('lName', res.user.lName);
            localStorage.setItem('image', res.user.image);
            localStorage.setItem('accessToken', res.tokens.accessToken);
            localStorage.setItem('refreshToken', res.tokens.refreshToken);

            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Login successful!',
            });

            this.closeModal();
          }
        },
        error: (error) => {
          console.error('Login Error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Invalid credentials, please try again.',
          });
        },
      });
    }
  }

  closeModal() {
    this.close.emit();
  }

  openLogin() {
    this.close.emit();
    this.isopenLogin.emit();
  }

  onSubmit() {
    if (this.signupForm.valid) {
      alert('Signup Successful!');
      this.closeModal();
    }
  }
}
