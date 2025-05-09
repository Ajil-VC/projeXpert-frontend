import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';
import { LayoutService } from '../../../../../../shared/services/layout.service';
import { FormsModule } from '@angular/forms';
import { BacklogService } from '../../data/backlog.service';
import { Task } from '../../../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-create-issue-button',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-issue-button.component.html',
  styleUrl: './create-issue-button.component.css'
})
export class CreateIssueButtonComponent {

  @Input() from!: string;

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  @ViewChild('inputFieldContainer') containerRef!: ElementRef<HTMLInputElement>;

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (this.isEditing && this.containerRef && !this.containerRef.nativeElement.contains(event.target as Node)) {
      this.createIssue();
    }
  }

  isEditing: boolean = false;
  inputValue: string = '';
  private focusInput = false;
  issueType: string = 'task';
  selectedEpic: string = '';

  constructor(private layoutSer: LayoutService, private backlogSer: BacklogService) { }

  ngOnInit() {
    this.backlogSer.selectedEpics$.subscribe({
      next: (res: Set<string>) => {
        if (res.size === 1) {
          this.selectedEpic = Array.from(res)[0];
        } else {
          this.selectedEpic = '';
        }
      },
      error: (err) => {
        console.error("Error occured while geting selected epics", err);
      }
    })
  }

  toggleEdit() {
    this.isEditing = true;
    this.focusInput = true;
  }

  ngAfterViewChecked(): void {
    // Focus the input element if flag is set
    if (this.focusInput && this.inputField) {
      this.inputField.nativeElement.focus();
      this.focusInput = false;
    }
  }

  updateValue(event: any) {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  createIssue() {

    if (this.inputValue.trim()) {

      const projectId = this.layoutSer.getProjectId();

      this.backlogSer.createIssue(
        projectId || '',
        this.issueType,
        this.inputValue.trim(),
        this.from,
        this.selectedEpic
      ).subscribe({
        next: (res: { status: boolean, result: Task }) => {
          this.backlogSer.addIssueSubject.next(res.result);
        },
        error: (err) => {
          console.error("Error occured while creating issue", err);
        }
      })

      this.inputValue = '';

    }
    this.isEditing = false;

  }
}
