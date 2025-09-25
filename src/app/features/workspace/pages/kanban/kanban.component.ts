import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TaskCardComponent } from "./presentation/task-card/task-card.component";
import { Task } from '../../../../core/domain/entities/task.model';
import { SharedService } from '../../../../shared/services/shared.service';
import { CdkDrag, CdkDragDrop, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { BacklogService } from '../backlog/data/backlog.service';
import { SearchPipe } from '../../../../core/pipes/search.pipe';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../auth/data/auth.service';
import { User } from '../../../../core/domain/entities/user.model';
import { SprintCompleteComponent } from './presentation/sprint-complete/sprint-complete.component';
import { Sprint, SprintTaskGroup } from '../../../../core/domain/entities/sprint.model';
import { NotificationService } from '../../../../core/data/notification.service';
import { ContentHeaderComponent } from '../../../reusable/content-header/content-header.component';
import { HeaderConfig } from '../../../../core/domain/entities/UI Interface/header.interface';
import { boardSwitcher, ButtonType, DropDown } from '../../../../core/domain/entities/UI Interface/button.interface';
import { LoaderComponent } from '../../../../core/presentation/loader/loader.component';
import { LoaderService } from '../../../../core/data/loader.service';
import { Roles } from '../../../../core/domain/entities/roles.model';
import { PermissionsService } from '../../../../shared/utils/permissions.service';
import { BaseChartDirective } from 'ng2-charts';
import { ChartData, ChartDataset, ChartOptions } from 'chart.js';

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
    LoaderComponent,
    BaseChartDirective
  ],
  templateUrl: './kanban.component.html',
  styleUrl: './kanban.component.css'
})
export class KanbanComponent {

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  dropDownData: DropDown[] = [];
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
        restriction: false
      },
      {
        type: 'dropdown',
        dropDownData: []
      },
      {
        type: 'select',

      }
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
      } else if (btn.type === 'dropdown') {
        if (btn.selectedOption) {
          if (btn.selectedOption === 'active') {

            this.refreshKanbanView();
          } else {

            this.getSprintWithTasks(btn.selectedOption);
          }
        }
      } else if (btn.type === 'select') {

        if (btn.action && 'viewType' in btn.action) {
          this.view.viewType = btn.action.viewType;
          if (this.view.viewType === 'sprint_report') {
            this.getSprintWithTasks();
          }
        }
      }
    }
  }

  setHeaderViewPermissions() {
    this.headerConfig.hideSearchBar = !this.permission.hasAny(['view_task', 'view_project', 'view_all_task']);
    if (this.headerConfig?.buttons) {
      for (let btn of this.headerConfig.buttons) {
        if (btn.type === 'main') {
          btn.restriction = !this.permission.has(['close_sprint']);
        } else if (btn.type === 'dropdown') {
          btn.restriction = !this.permission.has(['view_all_task']);
          btn.dropDownData = this.dropDownData;
        }
      }
    }
  }

  view: boardSwitcher = {
    viewType: 'board'
  }
  searchQuery = '';

  allTasks: Task[] = [];
  todoTasks: Task[] = [];
  inProgressTasks: Task[] = [];
  doneTasks: Task[] = [];
  userRole?: Roles;
  selectedSprint!: Sprint | null;
  completedTasksCount: {
    tasks: number,
    bugs: number,
    story: number
  } = { tasks: 0, bugs: 0, story: 0 };
  isLoading: boolean = false;


  constructor(
    private shared: SharedService,
    private backlogSer: BacklogService,
    public dialog: MatDialog,
    private authSer: AuthService,
    private toast: NotificationService,
    private loader: LoaderService,
    private permission: PermissionsService
  ) {
    this.setHeaderViewPermissions();
  }

  get spillOver() {
    if (this.selectedSprint) {
      if (this.selectedSprint.plannedPoints && this.selectedSprint.completedPoints) {
        return Number(this.selectedSprint.plannedPoints) - Number(this.selectedSprint.completedPoints)
      }
    }
    return 0;
  }
  get sprintCreatedBy() {
    if (this.selectedSprint) {
      if (typeof this.selectedSprint.createdBy !== 'string') {
        return this.selectedSprint.createdBy.email;
      }
    }
    return 'Not Available'
  }
  viewChanger(type: 'board' | 'sprint_report') {
    return this.view.viewType === type;
  }
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

  getSprintWithTasks(sprintId: string = '', activeSprint?: boolean) {
    this.loader.show();
    if (!sprintId && !this.selectedSprint) {
      activeSprint = true;
    } else if (!sprintId && this.selectedSprint) {
      sprintId = this.selectedSprint._id as string;
    }
    this.shared.getSprintWithTasks(sprintId, activeSprint).subscribe({
      next: (res) => {

        if (!res.status && res.code === 'NOT_ACTIVE_SPRINT') {
          this.selectedSprint = null;
          this.loader.hide();
          return;
        }

        this.selectedSprint = res.result;
        if (Array.isArray(res.result.tasks)) {
          this.allTasks = res.result.tasks as Task[];
          this.completedTasksCount.bugs = 0;
          this.completedTasksCount.story = 0;
          this.completedTasksCount.tasks = 0;
          for (let issue of this.allTasks) {
            if (issue.status === 'done') {

              if (issue.type === 'bug') {
                if (issue.subtasks && issue.subtasks.length > 0) {
                  this.completedTasksCount.bugs += issue.subtasks.length;
                } else {
                  this.completedTasksCount.bugs++;
                }
              } else if (issue.type === 'story') {
                if (issue.subtasks && issue.subtasks.length > 0) {
                  this.completedTasksCount.story += issue.subtasks.length;
                } else {
                  this.completedTasksCount.story++;
                }

              } else if (issue.type === 'task') {

                if (issue.subtasks && issue.subtasks.length > 0) {
                  this.completedTasksCount.tasks += issue.subtasks.length;
                } else {
                  this.completedTasksCount.tasks++;
                }
              }
            }
          }
          this.seperatingOnStatus();
          if (this.chart) {
            this.setBurnDownData();
            this.chart.update();
          }
          this.loader.hide();
        }
      },
      error: (err) => {
        this.selectedSprint = null;
        this.loader.hide();
      }
    })
  }
  refreshKanbanView() {

    this.loader.show();
    this.shared.completedSprintData().subscribe({
      next: (res) => {
        if (res.status && res.result) {

          this.dropDownData = res.result?.map(s => {
            return { name: s.name as string, value: s._id as string }
          });
          this.setHeaderViewPermissions();
        }
      }
    });

    this.getSprintWithTasks('', true);

    this.shared.getTasksInActiveSprints().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {

        if (!res.status) {
          this.allTasks = [];
          this.seperatingOnStatus();
          this.loader.hide();
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

    this.setHeaderViewPermissions();

    this.authSer.user$.subscribe({
      next: (res: User | null) => {
        if (res) {
          if (typeof res.role !== 'string') {
            this.userRole = res.role;
          }
        }
      }
    });

    this.refreshKanbanView();

    this.shared.currentPro$.subscribe((project) => {

      this.refreshKanbanView();

    });

    this.shared.reload$.subscribe({
      next: (res) => {
        if (res) {
          this.setHeaderViewPermissions();
          this.headerConfig = { ...this.headerConfig };
          this.allTasks = [];
          this.seperatingOnStatus();
          if (this.permission.hasAny(['view_task', 'view_project', 'view_all_task'])) {
            this.refreshKanbanView();
          }
        }
      }
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

      let sprint!: Sprint;
      let key = '';

      if (task.parentId) {
        continue;
      } else if (task.sprintId) {
        sprint = task.sprintId as Sprint;
        key = sprint._id as string;
      }

      if (!sprintMap.has(key)) {
        sprintMap.set(key, {
          sprint: sprint,
          tasks: []
        });
      }

      sprintMap.get(key)!.tasks.push(task);
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
      if (result?.status) {
        console.log(result)
        const sprint = result.completedTasks[0].sprintId as Sprint;
        this.dropDownData.push({ name: sprint.name as string, value: sprint._id as string });
        if (this.headerConfig.buttons) {
          const ind = this.headerConfig.buttons.findIndex(b => b.type === 'dropdown');
          this.headerConfig.buttons[ind].dropDownData = this.dropDownData;
          this.setHeaderViewPermissions()
        }
        this.toast.showSuccess('Sprint completed successfully')
        this.allTasks = [];
        this.seperatingOnStatus();
      }
    });

  }


  handleTaskUpdationEvent(task: Task) {

    const index = this.allTasks.findIndex(t => t._id === task._id);
    if (index !== -1) {
      this.allTasks[index] = task;
      this.seperatingOnStatus();
    }
  }



  lineChartLabels: string[] = [];

  lineChartData: ChartData<'line'> = {
    labels: this.lineChartLabels,
    datasets: []
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { display: true, position: 'top' as const },
      title: { display: true, text: 'Sprint Burndown Chart' }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  setBurnDownData() {
    if (this.selectedSprint && this.selectedSprint.startDate && this.selectedSprint.endDate) {
      const start = new Date(this.selectedSprint.startDate);
      const end = new Date(this.selectedSprint.endDate);

      this.lineChartLabels = this.generateSprintDays(start, end);

      this.lineChartData = {
        labels: this.lineChartLabels,
        datasets: [
          {
            label: 'Actual Burndown',
            data: this.selectedSprint.burndownData?.map(d => d.remainingPoints) || [],
            borderColor: '#42A5F5',
            fill: false,
            tension: 0.3,
          },
          {
            label: 'Ideal Burndown',
            data: this.generateIdealBurndown(this.selectedSprint.plannedPoints as number, start, end),
            borderColor: '#FF7043',
            borderDash: [5, 5],
            fill: false,
            tension: 0,
          }
        ]
      };
    }
  }

  generateSprintDays(startDate: Date, endDate: Date): string[] {
    const days: string[] = [];
    const current = new Date(startDate);

    while (current <= endDate) {

      const formatted = current.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });

      days.push(formatted);

      current.setDate(current.getDate() + 1);
    }

    return days;
  }

  generateIdealBurndown(plannedPoints: number, startDate: Date, endDate: Date): number[] {
    const dayCount =
      Math.floor((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    const pointsPerDay = plannedPoints / (dayCount - 1);
    const data: number[] = [];

    for (let i = 0; i < dayCount; i++) {
      data.push(Math.max(plannedPoints - (i * pointsPerDay), 0));
    }

    return data;
  }




}
