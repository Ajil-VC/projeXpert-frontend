import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Task } from '../../../../../../core/domain/entities/task.model';
import { SharedService } from '../../../../../../shared/services/shared.service';
import { Team } from '../../../../../../core/domain/entities/team.model';
import { BacklogService } from '../../data/backlog.service';

@Component({
  selector: 'app-issue-row',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './issue-row.component.html',
  styleUrl: './issue-row.component.css'
})
export class IssueRowComponent {


  @Input() issue!: Task;
  @Output() assign = new EventEmitter<any>();

  @Input() openIdFromBacklog: string = '';
  @Output() idFromIssueRow = new EventEmitter<string>();
  @Output() seletedIssueResponse = new EventEmitter<string>();

  constructor(private shared: SharedService, private eleRef: ElementRef, private backlogSer: BacklogService) { }

  isClicked: boolean = false;

  showAssigneeDropdown = false;
  searchText = '';
  teamMembers: Team[] = [];

  defaultStatus: string = 'status-default';

  ngOnInit() {

    this.shared.teamMembers$.subscribe({
      next: (res) => {
        if (res.status) {
          this.teamMembers = res.data;
        }
      },
      error: (err) => {
        console.error("Error fetching team members", err);
      }
    });
  }
  getTypeClass(): string {
    return `type-${this.issue.type.toLowerCase()}`;
  }

  getStatusClass(): string {
    switch (this.issue.status) {
      case 'todo':
        return 'status-todo';
      case 'in-progress':
        return 'status-in-progress';
      case 'done':
        return 'status-done';
      default:
        return 'status-default';
    }

  }

  onStatusChange(status: string) {
    this.backlogSer.updateIssueStatus(this.issue._id, status).subscribe({
      next: (res)=> {
        console.log('E yes');
      },
      error : (err) => {
        console.error("Error occured while tryging to change task status.",err);
      }
    })
  }


  updateSelectionStatus(issueId: string) {
    this.isClicked = !this.isClicked;
    this.seletedIssueResponse.emit(issueId);

  }


  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    if (this.isDropdownOpen && !this.eleRef.nativeElement.contains(event.target)) {
      this.idFromIssueRow.emit('');
    }
  }

  get isDropdownOpen() {
    return this.showAssigneeDropdown = this.openIdFromBacklog === this.issue._id;
  }
  toggleAssigneeDropdown() {
    this.idFromIssueRow.emit(this.issue._id);
  }

  filteredMembers() {
    if (!this.searchText) return this.teamMembers;
    return this.teamMembers.filter(member =>
      member.email.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  assignIssueTo(member: Team | '') {

    const memberId = member === '' ? '' : member._id;
    this.backlogSer.assignIssue(this.issue._id, memberId).subscribe({
      next: (res: { status: boolean, message: string, data: Task }) => {

        if (res.status) {
          this.issue = res.data;
          console.log(this.issue)
          this.assign.emit(this.issue);
        }

      },
      error: (err) => {
        console.error('Error while assigning issue to member', err);
      }
    });
    this.issue.assignedTo = memberId;
    this.idFromIssueRow.emit('');
  }


  getAssigneeLabel(issue: Task): string {
    if (!issue.assignedTo || typeof issue.assignedTo === 'string') {
      return '!';
    }
    return issue.assignedTo.email.charAt(0).toUpperCase();
  }

}
