import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-task-card',
  imports: [FormsModule,CommonModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {

  @Input() task:any
}
