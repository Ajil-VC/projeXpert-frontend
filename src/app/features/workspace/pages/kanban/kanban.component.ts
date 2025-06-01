import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from "./presentation/task-card/task-card.component";
import { Task } from '../../../../core/domain/entities/task.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BacklogService } from '../backlog/data/backlog.service';

@Component({
  selector: 'app-kanban',
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent,
    DragDropModule,
    CdkDropList,
    CdkDrag
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {

  searchQuery = '';

  allTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];

  constructor(private shared: SharedService, private backlogSer : BacklogService) { }


  onDrop(event: CdkDragDrop<any[]>) {
    const droppedTask = event.item.data;

    if (event.previousContainer === event.container) {
      // Reorder in same column
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      // Move task to another column
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Optional: update status on task (e.g., 'todo' -> 'in-progress')
      // droppedTask.status = this.getStatusByContainer(event.container.id);
      this.backlogSer.updateIssueStatus(droppedTask._id,event.container.id).subscribe({
        next: (res) => {
          if('status' in res && res.status === true){

            droppedTask.status = event.container.id;
          }
        },
        error : (err) => {
          console.error('Error occured while updating task status.',err);
        }
      });
      console.log('Moved task:', droppedTask);
      console.log(event.container.id, 'This is current');
    }
  }


  getStatusByContainer(containerId: string): string {
    switch (containerId) {
      case 'todoList': return 'todo';
      case 'inProgressList': return 'in-progress';
      case 'doneList': return 'done';
      default: return '';
    }
  }


  ngOnInit() {

    this.shared.getTasksInActiveSprints().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {
        console.log(res.result, 'Kittund');
        this.allTasks = res.result;
        this.seperatingOnStatus();
      },
      error: (err) => {
        console.error('Error occured while getting tasks', err);
      }
    });

  }

  seperatingOnStatus() {

    this.todoTasks = this.filteredTasks('todo');
    this.inProgressTasks = this.filteredTasks('in-progress');
    this.doneTasks = this.filteredTasks('done');
  }

  filteredTasks(status: "in-progress" | "todo" | "done") {
    // if (!this.searchQuery.trim()) return tasks;
    if (status === 'todo') {
      return this.allTasks.filter(task => task.status === 'todo');
    }

    if (status === 'in-progress') {
      return this.allTasks.filter(task => task.status === 'in-progress');
    }

    if (status === 'done') {
      return this.allTasks.filter(task => task.status === 'done');
    }

    return [];
  }

  completeSprint() {
    alert('Sprint Completed!');
  }

}
