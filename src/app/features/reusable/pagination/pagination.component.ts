import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pagination',
  imports: [CommonModule,FormsModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {

  currentPage = 1;
  totalPages = 10; // Set this based on backend response
  visiblePages: number[] = [];

  ngOnInit() {
    this.updateVisiblePages();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateVisiblePages();
    this.fetchProjects(page);
  }

  updateVisiblePages() {
    const visiblePages = [];
    const maxVisible = 5;
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    this.visiblePages = visiblePages;
  }

  fetchProjects(page: number) {
    // Replace this with your service call
    console.log(`Fetching projects for page ${page}`);
    // this.projectService.getProjects(page).subscribe(...)
  }

}
