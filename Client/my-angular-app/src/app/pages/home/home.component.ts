import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { TopicService } from '../../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SkeletonModule } from 'primeng/skeleton';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  CreateTopicInput,
  Topic,
  PaginatedTopics,
} from '../../shared/interface/topic.interface';
import { MessageService } from 'primeng/api';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { FeedsComponent } from '../feeds/feeds.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NavbarComponent,
    SidebarComponent,
    FeedsComponent,
    RouterOutlet,
    RouterModule,
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
    private router: Router,
    private messageService: MessageService
  ) {
    this.topicForm = this.fb.group({
      title: [
        '',
        [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(100),
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
          this.messageService.add({
            severity: 'success',
            detail: 'Topic post successfully!',
          });
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
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.isModalOpen = true;
    } else {
      this.messageService.add({
        severity: 'info',
        summary: 'Info',
        detail: 'Login first to start discussion',
      });
      this.isModalOpen = false;
    }
  }

  closeModal() {
    this.isModalOpen = false;
    this.topicForm.reset();
  }
}
