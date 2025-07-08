import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule, FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() totalPages!: number;
  @Output() pageChanged = new EventEmitter<number>();
  visiblePages: number[] = [];

  ngOnChanges() {
    this.updateVisiblePages();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.pageChanged.emit(page);
  }

  updateVisiblePages() {
    const visiblePages: number[] = [];
    const maxVisible = 3;

    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > this.totalPages) {
      end = this.totalPages;
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    this.visiblePages = visiblePages;
  }

}
