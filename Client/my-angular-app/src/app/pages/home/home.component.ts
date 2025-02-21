import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { Topic } from '../../shared/interface/topic.interface';
import { TopicService } from '../../shared/services/topic.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  topics: Topic[] = [];
  loading = true;
  error: any;

  constructor(private topicService: TopicService) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.topicService.fetchTopics().subscribe({
      next: (topics) => {
        this.topics = topics;
        this.loading = false;
        console.log(topics);
      },
      error: (err) => {
        this.error = err;
        this.loading = false;
      },
    });
  }
}
