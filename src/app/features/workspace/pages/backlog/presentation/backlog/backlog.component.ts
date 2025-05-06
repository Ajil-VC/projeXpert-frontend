import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BacklogHeaderComponent } from "../backlog-header/backlog-header.component";
import { EpicsComponent } from "../epics/epics.component";
import { SprintComponent } from "../sprint/sprint.component";
import { CreateBacklogComponent } from "../create-backlog/create-backlog.component";


@Component({
  selector: 'app-backlog',
  imports: [CommonModule, BacklogHeaderComponent, EpicsComponent, SprintComponent, CreateBacklogComponent],
  templateUrl: './backlog.component.html',
  styleUrl: './backlog.component.css'
})
export class BacklogComponent {

  title = 'scrum-board';


}
