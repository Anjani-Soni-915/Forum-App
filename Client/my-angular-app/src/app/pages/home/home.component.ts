import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TopicService } from '../../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router } from '@angular/router';
import {
  CreateTopicInput,
  Topic,
  PaginatedTopics,
} from '../../shared/interface/topic.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    ReactiveFormsModule,
    SkeletonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  topics: Topic[] = [];
  loading = true;
  isFetchingMore = false;
  error: string | null = null;
  topicForm: FormGroup;
  isModalOpen = false;

  currentPage = 1;
  totalPages = 1;
  pageSize = 10;

  constructor(
    private topicService: TopicService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.topicForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ],
      ],

      description: ['', Validators.required],
      tagsInput: [''],
    });
  }

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loading = true;
    this.topicService.fetchTopics(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedTopics) => {
        console.log('Fetched topics:', response);
        this.topics = response.topics;
        this.totalPages = response.totalPages;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching topics:', err);
        this.error = 'Failed to load topics. Please try again.';
        this.loading = false;
      },
    });
  }

  goToTopicDetail(topicId: number) {
    this.router.navigate(['/topic', topicId]);
  }

  @HostListener('window:scroll', [])
  onScroll(event: any) {
    if (
      this.loading ||
      this.isFetchingMore ||
      this.currentPage >= this.totalPages
    )
      return;

    const scrollTop = window.scrollY;
    const scrollHeight = document.documentElement.scrollHeight;
    const clientHeight = window.innerHeight;

    if (scrollTop + clientHeight >= scrollHeight - 50) {
      console.log('Scrolled to bottom, loading more topics...');
      this.loadMoreTopics();
    }
  }

  loadMoreTopics() {
    if (this.isFetchingMore || this.currentPage >= this.totalPages) return;

    this.isFetchingMore = true;
    this.currentPage++;

    console.log(`Loading Page: ${this.currentPage}`);

    this.topicService.fetchTopics(this.currentPage, this.pageSize).subscribe({
      next: (response: PaginatedTopics) => {
        if (response.topics.length === 0) {
          console.warn('No more topics found!');
          this.isFetchingMore = false;
          return;
        }
        this.topics = [...this.topics, ...response.topics];
        this.totalPages = response.totalPages;

        this.isFetchingMore = false;
      },
      error: (err) => {
        console.error('Error loading more topics:', err);
        this.isFetchingMore = false;
      },
    });
  }

  postTopic() {
    if (this.topicForm.invalid) return;

    const { title, description, tagsInput } = this.topicForm.value;
    const newTopic: CreateTopicInput = {
      title,
      description,
      likes: 0,
      views: 0,
      repliesCount: 0,
      tags: tagsInput?.trim()
        ? tagsInput
            .split(',')
            .map((tag: string) => tag.trim())
            .filter((tag: string) => tag !== '')
        : [],
    };

    this.topicService.createTopic(newTopic).subscribe({
      next: (response) => {
        if (response && response.topic) {
          this.topics = [response.topic, ...this.topics];
          this.topicForm.reset();
          this.isModalOpen = false;
          this.currentPage = 1;
          this.totalPages = 1;
          this.isFetchingMore = false;
          this.topics = [];
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.loadTopics();
        } else {
          console.error('Unexpected API response:', response);
        }
      },
      error: (err) => {
        this.error = 'Failed to post topic. Please try again.';
        console.error('Error posting topic:', err);
      },
    });
  }
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }
}

// import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { NavbarComponent } from '../../components/navbar/navbar.component';
// import { TopicService } from '../../shared/services/topic.service';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule } from '@angular/forms';
// import {
//   CreateTopicInput,
//   Topic,
// } from '../../shared/interface/topic.interface';

// @Component({
//   selector: 'app-home',
//   standalone: true,
//   imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
//   templateUrl: './home.component.html',
//   styleUrl: './home.component.scss',
// })
// export class HomeComponent implements OnInit {
//   topics: Topic[] = [];
//   loading = false;
//   error: string | null = null;
//   topicForm: FormGroup;
//   isModalOpen = false;

//   // Infinite Scroll Variables
//   offset = 0; // Tracks the number of topics loaded
//   pageSize = 4; // Number of topics per API call
//   allTopicsLoaded = false; // Prevents unnecessary API calls

//   @ViewChild('scrollAnchor', { static: false }) scrollAnchor!: ElementRef;

//   constructor(private topicService: TopicService, private fb: FormBuilder) {
//     this.topicForm = this.fb.group({
//       title: ['', Validators.required],
//       description: ['', Validators.required],
//       tagsInput: [''],
//     });
//   }

//   ngOnInit() {
//     this.loadTopics();
//     this.setupInfiniteScroll();
//   }

//   loadTopics() {
//     if (this.loading || this.allTopicsLoaded) return;
//     this.loading = true;

//     this.topicService.fetchTopics(this.offset, this.pageSize).subscribe({
//       next: (response) => {
//         if (response.topics.length > 0) {
//           this.topics = [...this.topics, ...response.topics];
//           this.offset += this.pageSize;
//         } else {
//           this.allTopicsLoaded = true;
//         }
//         this.loading = false;
//       },
//       error: (err) => {
//         this.error = 'Failed to load topics. Please try again.';
//         this.loading = false;
//       },
//     });
//   }

//   setupInfiniteScroll() {
//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) {
//           this.loadTopics();
//         }
//       },
//       { threshold: 1.0 }
//     );

//     setTimeout(() => {
//       if (this.scrollAnchor) {
//         observer.observe(this.scrollAnchor.nativeElement);
//       }
//     }, 1000);
//   }

//   postTopic() {
//     if (this.topicForm.invalid) return;

//     const { title, description, tagsInput } = this.topicForm.value;
//     const newTopic: CreateTopicInput = {
//       title,
//       description,
//       likes: 0,
//       views: 0,
//       repliesCount: 0,
//       tags: tagsInput
//         .split(',')
//         .map((tag: string) => tag.trim())
//         .filter((tag: string) => tag !== ''),
//     };

//     this.topicService.createTopic(newTopic).subscribe({
//       next: (response) => {
//         if (response && response.topic) {
//           this.topics = [response.topic, ...this.topics];
//           this.topicForm.reset();
//           this.isModalOpen = false;
//         }
//       },
//       error: (err) => {
//         this.error = 'Failed to post topic. Please try again.';
//       },
//     });
//   }

//   openModal() {
//     this.isModalOpen = true;
//   }

//   closeModal() {
//     this.isModalOpen = false;
//   }
// }
