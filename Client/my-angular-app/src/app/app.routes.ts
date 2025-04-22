import { Routes } from '@angular/router';
import { HomeComponent } from '../app/pages/home/home.component';
import { TopicDetailsComponent } from './pages/topic-details/topic-details.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },

  { path: 'topic/:id', component: TopicDetailsComponent },

  { path: '**', redirectTo: '' },
];
