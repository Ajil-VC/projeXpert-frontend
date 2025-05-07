import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TransformButtonComponent } from "../transform-button/transform-button.component";
import { Task } from '../../../../../../core/domain/entities/task.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-epics',
  imports: [
    CommonModule,
    TransformButtonComponent,
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

  ngOnInit() {

  }

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

  createNewEpic(): void {

  }

  addEpicToList(res: Task) {
    this.epics.push(res);
  }
  deleteProject(epic: any, epicId: string) {

    console.log(epicId);
  }
  updateCheckStatus(epicId: string, event: any) {
    if(this.checkedEpics.has(epicId)){
      this.checkedEpics.delete(epicId);
    }else{
      this.checkedEpics.add(epicId);
    }
  }


}
