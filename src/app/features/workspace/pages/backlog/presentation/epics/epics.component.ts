import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransformButtonComponent } from "../transform-button/transform-button.component";
import { Task } from '../../../../../../core/domain/entities/task.model';
import { FormsModule } from '@angular/forms';
import { BacklogService } from '../../data/backlog.service';
import { MatDialog } from '@angular/material/dialog';
import { CreateEpicComponent } from '../create-epic/create-epic.component';
import { NotificationService } from '../../../../../../core/data/notification.service';

@Component({
  selector: 'app-epics',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css'
})
export class EpicsComponent {


  isHidden: boolean = false;

  @Input() epics: Task[] = [];
  epicCount = this.epics.length;
  selectedEpic = this.epics[0];

  expandedEpics: Set<string> = new Set();
  checkedEpics: Set<string> = new Set();

  constructor(private backlogSer: BacklogService, private dialog: MatDialog, private toast: NotificationService) { }

  toggleEpicDetails(epic: Task): void {
    const epicId = epic._id;

    if (this.expandedEpics.has(epicId)) {
      this.expandedEpics.delete(epicId);
    } else {
      this.expandedEpics.add(epicId);
    }

    this.selectedEpic = epic;
  }
  isEpicExpanded(epicId: string): boolean {
    return this.expandedEpics.has(epicId);
  }


  hideEpics() {
    this.isHidden = !this.isHidden;

  }



  addEpicToList(res: Task) {
    this.epics.push(res);
  }
  deleteProject(epic: any, epicId: string) {

    console.log(epicId);
  }
  updateCheckStatus(epicId: string, event: any) {
    if (this.checkedEpics.has(epicId)) {
      this.checkedEpics.delete(epicId);
    } else {
      this.checkedEpics.add(epicId);
    }

    this.backlogSer.setEpicIds(this.checkedEpics);
  }



  createOrUpdateEpic(epic: Task | null = null): void {

    const dialogRef = this.dialog.open(CreateEpicComponent, {
      width: '600px',
      data: { issue: epic }
    });

    dialogRef.afterClosed().subscribe({
      next: (result: { title: string, description: string, startDate: string, endDate: string }) => {
        if (!result?.title) return;
        this.backlogSer.createOrUpdateEpic(result.title, result.description, result.startDate, result.endDate, epic)
          .subscribe({
            next: (res) => {
              if (res.status) {
                if (!epic) {
                  this.epics.push(res.result);
                } else {
                  const ind = this.epics.findIndex(ep => ep._id === res.result._id);
                  if (ind !== -1) {
                    this.epics[ind] = res.result;
                  }

                }
              } else {
                this.toast.showError('Failed to create epic');
              }
            },
            error: (err) => {
              this.toast.showError('Failed to create epic');
            }
          });
      }
    })
  }



}
