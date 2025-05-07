import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BacklogHeaderComponent } from "../backlog-header/backlog-header.component";
import { EpicsComponent } from "../epics/epics.component";
import { SprintComponent } from "../sprint/sprint.component";
import { CreateBacklogComponent } from "../create-backlog/create-backlog.component";
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Task } from '../../../../../../core/domain/entities/task.model';


@Component({
  selector: 'app-backlog',
  imports: [CommonModule, BacklogHeaderComponent, EpicsComponent, SprintComponent, CreateBacklogComponent],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent {

  title = 'scrum-board';
  isProjectSelected: boolean = true;
  epics!: Task[];

  constructor(private shared: SharedService) { }

  ngOnInit() {

    this.shared.currentPro$.subscribe({
      next: (res) => {
        if (!res) {
          this.isProjectSelected = false;
        } else {
          this.isProjectSelected = true;
        }
      },
      error: (err) => {
        console.error("Something went wrong", err);
      }
    })

    this.shared.getTasksInProject().subscribe({
      next: (res: { status: boolean, result: Task[] }) => {

        this.epics = res.result.filter(epic => epic.type === 'epic');
        console.log(res.result, 'gettasks');
      },
      error: (err) => {
        console.log("Error occured while getting tasks", err);
      }
    })

  }

}
