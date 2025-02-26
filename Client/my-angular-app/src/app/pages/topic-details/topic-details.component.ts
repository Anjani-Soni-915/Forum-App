import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Topic } from '../../shared/interface/topic.interface';
import { TopicService } from '../../shared/services/topic.service';
import { LikeTopicService } from '../../shared/services/likeTopic.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-topic-details',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './topic-details.component.html',
  styleUrls: ['./topic-details.component.scss'],
})
export class TopicDetailsComponent implements OnInit {
  topic: Topic | null = null;
  likesCount: number = 0;
  likeStatus: boolean | null = null;

  loading = false;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private topicService: TopicService,
    private likeTopicService: LikeTopicService
  ) {}

  ngOnInit() {
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
          replyData: response.replyData || [],
        };
        this.likesCount = response.likes;
        const userLike = response.topicLikesData.find(
          (like: any) => like.userId === 4 // Static now
        );
        if (userLike) {
          this.likeStatus = userLike.status;
        }

        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load topic details.';
        this.loading = false;
      },
    });
  }
  toggleReplyLike(reply: any) {
    reply.likes = reply.likes + 1; // Increment likes (replace with actual API logic)
    console.log(`Reply ${reply.id} liked!`);
  }

  toggleLike() {
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
