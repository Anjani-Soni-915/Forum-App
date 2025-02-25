import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TopicService } from '../../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
  CreateTopicInput,
  Topic,
} from '../../shared/interface/topic.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [NavbarComponent, CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  topics: Topic[] = [];
  loading = true;
  error: string | null = null;
  topicForm: FormGroup;
  isModalOpen = false;

  constructor(private topicService: TopicService, private fb: FormBuilder) {
    this.topicForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      tagsInput: [''],
    });
  }

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.loading = true;

    this.topicService.fetchTopics().subscribe({
      next: (topics) => {
        console.log('Fetched topics:', topics);
        this.topics = [...topics];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching topics:', err);
        this.error = 'Failed to load topics. Please try again.';
        this.loading = false;
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
      tags: tagsInput
        .split(',')
        .map((tag: string) => tag.trim())
        .filter((tag: string) => tag !== ''),
    };

    this.topicService.createTopic(newTopic).subscribe({
      next: (response) => {
        if (response && response.topic) {
          this.topics = [response.topic, ...this.topics];
          this.topicForm.reset();
          this.isModalOpen = false;
          console.log('data------->', this.topics);
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
