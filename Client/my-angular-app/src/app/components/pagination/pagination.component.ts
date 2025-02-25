import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatorModule } from 'primeng/paginator';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, PaginatorModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.scss',
})
export class PaginationComponent {
  @Input() totalRecords = 0;
  @Input() rows = 5;
  @Input() currentPage = 1;
  @Output() pageChange = new EventEmitter<any>();

  changePage(event: any) {
    console.log('Page changed:', event);
    this.pageChange.emit(event);
  }
}
