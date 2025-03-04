import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ReplyData, Topic } from '../../shared/interface/topic.interface';
import { TopicService } from '../../shared/services/topic.service';
import { LikeTopicService } from '../../shared/services/likeTopic.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { ReplyModalComponent } from '../../components/reply-modal/reply-modal.component';
import { MessageService } from 'primeng/api';
import { SocketService } from '../../shared/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    ReplyModalComponent,
  ],
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
})
export class TopicDetailsComponent implements OnInit {
  topic: Topic | null = null;
  likesCount: number = 0;
  likeStatus: boolean | null = null;
  showReplyModal = false;

  loading = false;
  error: string | null = null;
  userId = localStorage.getItem('userId') || 0;
  notificationSubscription: Subscription | null = null;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private likeTopicService: LikeTopicService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }

    console.log('onInit triggered');
    this.getTopicById();

    if (this.userId) {
      const firstName = localStorage.getItem('fName') || '';
      const lastName = localStorage.getItem('lName') || '';
      const id = Number(this.userId);

      // this.listenForNotifications(id);
    }
  }

  // // Listen for notifications
  // listenForNotifications(userId: number) {
  //   this.notificationSubscription = this.socketService
  //     .listenForNotifications(userId)
  //     .subscribe((data: any) => {
  //       console.log('Socket notification received ✨', data);
  //       // if (data?.message) {
  //       //   this.messageService.add({
  //       //     severity: 'info',
  //       //     summary: 'New Like',
  //       //     detail: `${data.message}`,
  //       //     sticky: true,
  //       //   });
  //       // }
  //     });
  // }

  // ngOnDestroy(): void {
  //   this.notificationSubscription?.unsubscribe();
  // }

  getTopicById() {
    this.loading = true;
    const topicId = this.route.snapshot.paramMap.get('id');

    if (!topicId || isNaN(+topicId)) {
      this.error = 'Invalid topic ID';
      this.loading = false;
      return;
    }

    this.topicService.fetchTopicById(+topicId).subscribe({
      next: (response: any) => {
        this.topic = {
          ...response,
          replyData: response.replyData.map((reply: any) => ({
            ...reply,
            status: reply.status ?? false,
          })),
        };
        this.likesCount = response.likes || 0;

        const userLike = response.topicLikesData?.find(
          (like: any) => like.userId === this.userId
        );

        this.likeStatus = userLike ? userLike.status : false;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load topic details.';
        this.loading = false;
      },
    });
  }
  onReplyPosted(reply: ReplyData) {
    if (!this.topic?.replyData) return;

    this.topic.replyData.unshift(reply);
  }

  checkIsLiked(reply: ReplyData) {
    return reply.replyLikesData?.find((likes) => likes?.userId === this.userId)
      ?.status;
  }

  toggleReplyLike(reply: ReplyData, replyIndex: number) {
    const userId = localStorage.getItem('userId') || 0;
    if (!userId) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login to like!',
      });
    }
    if (!this.topic?.replyData) return;

    this.likeTopicService.createReplyLike({ replyId: reply.id }).subscribe({
      next: (response) => {
        if (response && response.replyLikes) {
          const currentUserLike = reply?.replyLikesData?.findIndex(
            (likes) => likes?.userId === this.userId
          );
          const allLikes = [...reply?.replyLikesData];
          if (currentUserLike >= 0) {
            allLikes?.splice(currentUserLike, 1, {
              ...response?.replyLikes,
            });
          } else {
            allLikes?.push({
              ...response?.replyLikes,
            });
          }
          const updatedReply = {
            ...reply,
            replyLikesData: [...allLikes],
            likes: response?.replyLikes?.status
              ? reply?.likes + 1
              : reply?.likes - 1,
          };
          this.topic?.replyData.splice(replyIndex, 1, updatedReply);
        }
      },
      error: () => {
        this.topic!.replyData[replyIndex] = reply;
      },
    });
  }

  toggleLike() {
    const userId = localStorage.getItem('userId') || 0;
    if (!userId) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login to like!',
      });
    }
    if (!this.topic) return;

    const prevLikes = this.likesCount;
    const prevStatus = this.likeStatus;

    const newStatus = this.likeStatus === null ? true : !this.likeStatus;

    this.likeStatus = newStatus;
    this.likesCount += newStatus ? 1 : -1;

    this.likeTopicService
      .createTopicLike({ topicId: this.topic.id })
      .subscribe({
        next: (response) => {
          this.likeStatus = response.topicLikes.status;
          this.likesCount = this.likeStatus ? prevLikes + 1 : prevLikes - 1;
        },
        error: () => {
          this.likeStatus = prevStatus;
          this.likesCount = prevLikes;
        },
      });
  }

  openReplyModal() {
    const userId = localStorage.getItem('userId') || 0;
    if (!userId) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login to Reply!',
      });
      this.showReplyModal = false;
    } else if (this.topic?.id) {
      this.showReplyModal = true;
    }
  }
}
