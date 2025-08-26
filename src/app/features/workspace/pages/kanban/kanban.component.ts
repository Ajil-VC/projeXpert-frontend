import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from "./presentation/task-card/task-card.component";
import { Task } from '../../../../core/domain/entities/task.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BacklogService } from '../backlog/data/backlog.service';
import { SearchPipe } from '../../../../core/pipes/search.pipe';
import { MatDialog } from '@angular/material/dialog';
import { TaskDetailsComponent } from './presentation/task-details/task-details.component';
import { AuthService } from '../../../auth/data/auth.service';
import { User } from '../../../../core/domain/entities/user.model';
import { SprintCompleteComponent } from './presentation/sprint-complete/sprint-complete.component';
import { Sprint, SprintTaskGroup } from '../../../../core/domain/entities/sprint.model';
import { NotificationService } from '../../../../core/data/notification.service';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { ButtonType } from '../../../../core/domain/entities/UI Interface/button.interface';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';
import { LoaderService } from '../../../../core/data/loader.service';


@Component({
  selector: 'app-kanban',
  imports: [
    CommonModule,
    FormsModule,
    TaskCardComponent,
    DragDropModule,
    CdkDropList,
    CdkDrag,
    SearchPipe,
    ContentHeaderComponent,
    LoaderComponent
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {


  headerConfig: HeaderConfig = {

    title: 'Board',
    icon: '📝',
    subtitle: 'Manage your project tasks here.',
    placeHolder: 'Search tasks...',
    searchQuery: '',
    buttons: [
      {
        type: 'main',
        label: '+ Complete Sprint',
      },
    ]

  }
  handleSearchEvent(event: string) {
    this.searchQuery = event.toLowerCase();
    // this.filterMeetings();
  }
  handlebuttonClick(btn: ButtonType) {
    if (btn.triggeredFor === this.headerConfig.title) {
      if (btn.type === 'main') {
        this.completeSprint();
      }
    }
  }


  searchQuery = '';

  allTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  userRole: string = '';

  isLoading: boolean = false;

  constructor(
    private shared: SharedService,
    private backlogSer: BacklogService,
    public dialog: MatDialog,
    private authSer: AuthService,
    private toast: NotificationService,
    private loader: LoaderService
  ) { }


  onDrop(event: CdkDragDrop<any[]>) {
    // this.loadService.
    const droppedTask = event.item.data;
    this.loader.show();

    if (event.previousContainer === event.container) {
      // Reorder in same column
      this.loader.hide();
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {

      // droppedTask.status = this.getStatusByContainer(event.container.id);
      this.backlogSer.updateIssueStatus(droppedTask._id, event.container.id).subscribe({
        next: (res) => {
          if ('status' in res && res.status === true) {

            this.loader.hide();
            transferArrayItem(
              event.previousContainer.data,
              event.container.data,
              event.previousIndex,
              event.currentIndex
            );

            droppedTask.status = event.container.id;
          }
        },
        error: (err) => {
          this.loader.hide();
          this.toast.showError('Failed to update the task status');
        }
      });
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


  refreshKanbanView() {

    this.loader.show();

    this.shared.getTasksInActiveSprints().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {

        if (!res.status) {
          this.allTasks = [];
          this.seperatingOnStatus();
          return;
        }
        
        this.allTasks = res.result;
        this.seperatingOnStatus();
        this.loader.hide();

      },
      error: (err) => {
        this.loader.hide();
        this.toast.showError('Failed to get tasks in active sprint.');
      }
    });

  }


  ngOnInit() {
    this.authSer.user$.subscribe({
      next: (res: User | null) => {
        if (res) {
          this.userRole = res.role;
        }
      }
    });

    this.refreshKanbanView();

    this.shared.currentPro$.subscribe((project) => {

      this.refreshKanbanView();

    })

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


  groupTasksBySprint(): SprintTaskGroup[] {

    const sprintMap = new Map<string, SprintTaskGroup>();
    for (let task of this.allTasks) {
      const sprint = task.sprintId as Sprint;
      const key = sprint._id;

      if (!sprintMap.has(key as string)) {
        sprintMap.set(key as string, {
          sprint: sprint,
          tasks: []
        });
      }

      sprintMap.get(key as string)!.tasks.push(task);
    }

    return Array.from(sprintMap.values());
  }


  completeSprint() {
    const groupedTasks = this.groupTasksBySprint()

    const dialogRef = this.dialog.open(SprintCompleteComponent, {
      width: '500px',
      data: { groupedTasks }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.status) {

        for (let task of result.result) {
          const ind = this.allTasks.findIndex((item: Task) => item._id == task._id);
          if (ind !== -1) {
            if (!task.sprintId || (task.sprintId && task.sprintId.status !== 'active')) {

              this.allTasks.splice(ind, 1);

            } else {

              this.allTasks[ind] = task

            }

          }
        }
        this.toast.showSuccess('Sprint completed successfully')
        const completedTaskIds = new Set(result.completedTasks.map((task: Task) => task._id));
        this.allTasks = this.allTasks.filter(task => !completedTaskIds.has(task._id));
        this.seperatingOnStatus();
      }
    });

  }


  taskDetails(event: Event, task: Task): void {
    event.stopPropagation();
    
    const dialogRef = this.dialog.open(TaskDetailsComponent, {
      width: '500px',
      data: {
        task: { ...task },
        userRole: this.userRole
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {

        const index = this.allTasks.findIndex(task => task._id === result._id);
        if (index !== -1) {
          this.allTasks[index] = result;
          this.toast.showSuccess(`Successfully updated the task ${result.title}`);
          this.seperatingOnStatus();
        }

      }
    });

  }

}
