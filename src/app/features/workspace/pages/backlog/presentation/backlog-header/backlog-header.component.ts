import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-backlog-header',
  imports: [
    CommonModule
  ],
  templateUrl: './backlog-header.component.html',
  styleUrl: './backlog-header.component.css'
})
export class BacklogHeaderComponent {

  epicCount = 2;
}
