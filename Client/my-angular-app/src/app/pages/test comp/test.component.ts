import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TopicService } from '../../shared/services/topic.service';
import {
  Topic,
  CreateTopicInput,
} from '../../shared/interface/topic.interface';

@Component({
  selector: 'test-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.scss'],
})
export class TestComponent implements OnInit {
  topics: Topic[] = [];
  loading = true;
  error: any;
  newTopic: CreateTopicInput = {
    title: '',
    description: '',
    likes: 0,
    views: 0,
    repliesCount: 0,
    tags: [],
  };
  tagsInput = '';

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.topicService.fetchTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
        this.loading = false;
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }

  addTopic() {
    this.newTopic.tags = this.tagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');
    console.log('data------------>', this.newTopic);
    this.topicService.createTopic(this.newTopic).subscribe({
      next: (response) => {
        console.log('Created topic:', response);
        this.loadTopics();
        this.resetForm();
      },
      error: (err) => {
        this.error = err;
      },
    });
  }

  resetForm() {
    this.newTopic = {
      title: '',
      description: '',
      likes: 0,
      views: 0,
      repliesCount: 0,
      tags: [],
    };
    this.tagsInput = '';
  }
}
