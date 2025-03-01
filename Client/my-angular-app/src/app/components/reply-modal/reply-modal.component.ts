import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ReplyService } from '../../shared/services/reply.service';
import { Reply } from '../../shared/interface/reply.interface';
import { ReplyData } from '../../shared/interface/topic.interface';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-reply-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reply-modal.component.html',
  styleUrls: ['./reply-modal.component.scss'],
})
export class ReplyModalComponent implements OnInit {
  @Input() topicId!: number;
  @Output() close = new EventEmitter<void>();
  @Output() replyPosted = new EventEmitter<Reply>(); // Emit new reply data

  replyForm: FormGroup;
  loading = false;
  userId = localStorage.getItem('userId') || 0;

  constructor(
    private fb: FormBuilder,
    private replyService: ReplyService,
    private messageService: MessageService
  ) {
    this.replyForm = this.fb.group({
      text: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  // postReply() {
  //   if (this.replyForm.invalid || !this.topicId) return;

  //   this.loading = true;

  //   const input = {
  //     topicId: this.topicId,
  //     text: this.replyForm.value.text.trim(),
  //     likes: 0,
  //   };

  //   this.replyService.createReply(input).subscribe({
  //     next: (response) => {
  //       this.replyForm.reset();
  //       this.loading = false;
  //       this.replyPosted.emit(response.reply);
  //       this.close.emit();

  //     },
  //     error: () => {
  //       this.loading = false;
  //     },
  //   });
  // }
  postReply() {
    if (this.replyForm.invalid || !this.topicId) return;

    this.loading = true;

    const input = {
      topicId: this.topicId,
      text: this.replyForm.value.text.trim(),
      likes: 0,
    };

    this.replyService.createReply(input).subscribe({
      next: (response) => {
        console.log('API Response:', response);
        if (response && response.reply) {
          const newReply: Reply = {
            ...response.reply,
            createdAt: response.reply?.createdAt || new Date().toISOString(),
            replyLikesData: response.reply.replyLikesData || [],
            userData: response.reply.userData || {
              id: 0,
              fName: '',
              lName: '',
              image: '',
            },
          };

          this.replyForm.reset();
          this.loading = false;
          this.replyPosted.emit(newReply);
          this.close.emit();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Topic post successfully!',
          });
        }
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  closeModal() {
    this.close.emit();
  }
}
