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

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private likeTopicService: LikeTopicService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    const storedUserId = localStorage.getItem('userId');

    if (storedUserId) {
      this.userId = +storedUserId;
    }
    console.log('on in it');
    this.getTopicById();
  }

  // getTopicById() {
  //   this.loading = true;
  //   const topicId = this.route.snapshot.paramMap.get('id');

  //   if (!topicId || isNaN(+topicId)) {
  //     this.error = 'Invalid topic ID';
  //     this.loading = false;
  //     return;
  //   }

  //   this.topicService.fetchTopicById(+topicId).subscribe({
  //     next: (response: any) => {
  //       this.topic = {
  //         ...response,
  //         replyData: response.replyData || [],
  //       };
  //       this.likesCount = response.likes || 0;

  //       const userLike = response.topicLikesData?.find(
  //         (like: any) => like.userId === this.userId
  //       );

  //       this.likeStatus = userLike ? userLike.status : false;

  //       this.loading = false;
  //     },
  //     error: () => {
  //       this.error = 'Failed to load topic details.';
  //       this.loading = false;
  //     },
  //   });
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
        console.log('data------------>', this.topic, response);
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
    console.log('id-------------->', userId);
    if (!userId) {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login to like !',
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
        detail: 'Login to like !',
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

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { Topic } from '../../shared/interface/topic.interface';
// import { TopicService } from '../../shared/services/topic.service';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import { LikeTopicService } from '../../shared/services/likeTopic.service';

// @Component({
//   selector: 'app-topic-details',
//   standalone: true,
//   imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
//   templateUrl: './topic-details.component.html',
//   styleUrls: ['./topic-details.component.scss'],
// })
// export class TopicDetailsComponent implements OnInit {
//   topic: Topic | null = null;
//   loading = false;
//   error: string | null = null;
//   likeStatus: boolean | null = false;
//   likesCount: number = 0;

//   constructor(
//     private route: ActivatedRoute,
//     private topicService: TopicService,
//     private likeTopicService: LikeTopicService
//   ) {}

//   ngOnInit() {
//     this.getTopicById();
//   }

//   getTopicById() {
//     console.log('getTopicById() is being called!');
//     this.loading = true;
//     const topicId = this.route.snapshot.paramMap.get('id');

//     if (!topicId || isNaN(+topicId)) {
//       console.log('Invalid ID:', topicId);
//       this.error = 'Invalid topic ID';
//       this.loading = false;
//       return;
//     }

//     console.log('Fetching topic with ID:', topicId);

//     this.topicService.fetchTopicById(+topicId).subscribe({
//       next: (response) => {
//         this.topic = response;
//         this.loading = false;
//         this.likesCount=response.likes;
//         console.log('Topic Response:', this.topic);
//       },
//       error: (err) => {
//         this.error = 'Failed to load topic details. Please try again.';
//         this.loading = false;
//         console.error('Error fetching topic:', err);
//       },
//     });
//   }

//   // toggleLike() {
//   //   if (!this.topic) return;

//   //   this.likeTopicService
//   //     .createTopicLike({ topicId: this.topic.id })
//   //     .subscribe({
//   //       next: (response) => {
//   //         if (!response || !response.topicLikes) {
//   //           console.error('Invalid response:', response);
//   //           return;
//   //         }

//   //         const { status } = response.topicLikes;
//   //         this.likeStatus = status;
//   //         this.topic!.likes += status ? 1 : -1;
//   //         console.log('Like status updated:', this.likeStatus);
//   //       },
//   //       error: (err) => {
//   //         console.error('Error updating like status:', err);
//   //       },
//   //     });
//   // }
//   toggleLike() {
//     if (!this.topic) return;

//     // Optimistically update UI first
//     const newLikeStatus = !this.likeStatus;
//     this.likeStatus = newLikeStatus;
//     this.likesCount += newLikeStatus ? 1 : -1; // Increment or decrement likes count

//     // Send request to API
//     this.likeTopicService
//       .createTopicLike({ topicId: this.topic.id })
//       .subscribe({
//         next: (response) => {
//           if (!response || !response.topicLikes) {
//             console.error('Invalid response:', response);
//             return;
//           }

//           const { status } = response.topicLikes;
//           this.likeStatus = status;
//           this.likesCount = status ? this.likesCount : this.likesCount; // Keep count consistent
//           console.log(
//             'Like status updated:',
//             this.likeStatus,
//             'Likes:',
//             this.likesCount
//           );
//         },
//         error: (err) => {
//           console.error('Error updating like status:', err);
//           // Revert state if API call fails
//           this.likeStatus = !newLikeStatus;
//           this.likesCount -= newLikeStatus ? 1 : -1;
//         },
//       });
//   }
// }
