import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
import { SubscriptionComponent } from '../../components/subscription/subscription.component';
import { ChangeDetectorRef } from '@angular/core';
import { Skeleton } from 'primeng/skeleton';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    ReplyModalComponent,
    SubscriptionComponent,
    Skeleton
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
    private socketService: SocketService,
    private cdr: ChangeDetectorRef,
    private router : Router
  ) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      this.userId = parseInt(storedUserId, 10);
    }

    console.log('onInit triggered');
    this.getTopicById();
  }

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

        // Real time topic like update
        this.socketService
          .onLikeUpdated(this.topic?.id!)
          .subscribe(({ likeCount }) => {
            this.likesCount = likeCount;
          });

        this.topic?.replyData.forEach((reply) => {
          if (reply.id) {
            this.socketService
              .onReplyLikeUpdated(reply.id)
              .subscribe(({ likeCount }) => {
                console.log(`🔥 Reply ${reply.id} like updated:`, likeCount);
                reply.likes = likeCount;
                this.cdr.detectChanges();
              });
          }
        });
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

  handleBackClick(){
    this.router.navigateByUrl('/');
  }

  // checkIsLiked(reply: ReplyData) {
  //   return reply.replyLikesData?.find((likes) => likes?.userId === this.userId)
  //     ?.status;
  // }

  // toggleReplyLike(reply: ReplyData, replyIndex: number) {
  //   const userId = localStorage.getItem('userId') || 0;
  //   if (!userId) {
  //     this.messageService.add({
  //       severity: 'info',
  //       summary: 'Info',
  //       detail: 'Login to like!',
  //     });
  //   }
  //   if (!this.topic?.replyData) return;

  //   this.likeTopicService.createReplyLike({ replyId: reply.id }).subscribe({
  //     next: (response) => {
  //       if (response && response.replyLikes) {
  //         const currentUserLike = reply?.replyLikesData?.findIndex(
  //           (likes) => likes?.userId === this.userId
  //         );
  //         const allLikes = [...reply?.replyLikesData];
  //         if (currentUserLike >= 0) {
  //           allLikes?.splice(currentUserLike, 1, {
  //             ...response?.replyLikes,
  //           });
  //         } else {
  //           allLikes?.push({
  //             ...response?.replyLikes,
  //           });
  //         }
  //         const updatedReply = {
  //           ...reply,
  //           replyLikesData: [...allLikes],
  //           likes: response?.replyLikes?.status
  //             ? reply?.likes + 1
  //             : reply?.likes - 1,
  //         };
  //         this.topic?.replyData.splice(replyIndex, 1, updatedReply);
  //       }
  //     },
  //     error: () => {
  //       this.topic!.replyData[replyIndex] = reply;
  //     },
  //   });
  // }
  checkIsLiked(reply: ReplyData): boolean {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) return false;

    const userLike = reply.replyLikesData?.find(
      (like) => like.userId === userId
    );
    return userLike ? userLike.status : false;
  }

  toggleReplyLike(reply: ReplyData) {
    const userId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!userId) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login to like!',
      });
      return;
    }

    this.likeTopicService.createReplyLike({ replyId: reply.id }).subscribe({
      next: (response) => {
        if (response && response.replyLikes) {
          // reply.likes += response.replyLikes.status ? 1 : -1;
          reply.replyLikesData = [{ ...response.replyLikes }];
          this.cdr.detectChanges();
        }
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

  getSubscriptionStatus(subscriptionData: any[]): boolean {
    const userId = localStorage.getItem('userId');
    if (!subscriptionData) return false;

    // Find if the user is subscribed
    const userSubscription = subscriptionData.find((sub) => {
      return sub.userId?.toString() === userId?.toString();
    });

    return userSubscription ? userSubscription.status : false;
  }
}
