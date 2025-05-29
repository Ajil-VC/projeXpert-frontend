import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from "./task-card/task-card.component";
import { Task } from '../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-kanban',
  imports: [CommonModule, FormsModule, TaskCardComponent],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {

  searchQuery = '';

  todoTasks:Task[] = [
    {
      _id: '1',
      title: 'First',
      type: "task",
      status: "in-progress" ,
      priority: 'low' ,
      assignedTo:'hjh',
      epicId:'a',
      sprintId: 'sprint1',
      projectId: 'project1',

      description:'hahaha', 
      parentId:'parent1', 
      createdAt:new Date, 
      updatedAt:new Date
    }
  ];

  inProgressTasks = [
    { title: 'Fast trip search', tag: 'ACCOUNTS', ticket: 'NUC-342', time: '4h', priority: 'red' },
    { title: 'Fast trip search', tag: 'ACCOUNTS', ticket: 'NUC-342', time: '4h', priority: 'red' },
    { title: 'Fast trip search', tag: 'ACCOUNTS', ticket: 'NUC-342', time: '4h', priority: 'red' }
  ];

  doneTasks = [
    { title: 'Customers reporting shopping cart purchasing issues', tag: 'ACCOUNTS', ticket: 'NUC-344', time: '2h', status: 'done' },
    { title: 'Customers reporting shopping cart purchasing issues', tag: 'ACCOUNTS', ticket: 'NUC-344', time: '2h', status: 'done' }
  ];



  filteredTasks(tasks: Task[]) {
    if (!this.searchQuery.trim()) return tasks;
    return tasks.filter(task =>
      task.title.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  completeSprint() {
    alert('Sprint Completed!');
  }

}
