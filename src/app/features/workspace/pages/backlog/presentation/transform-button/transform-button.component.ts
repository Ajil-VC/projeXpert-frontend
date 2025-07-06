import { CommonModule } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { LayoutService } from '../../../../../../shared/services/layout.service';
import { BacklogService } from '../../data/backlog.service';
import { Task } from '../../../../../../core/domain/entities/task.model';

@Component({
  selector: 'app-transform-button',
  imports: [
    CommonModule
  ],
  templateUrl: './transform-button.component.html',
  styleUrl: './transform-button.component.css'
})
export class TransformButtonComponent implements AfterViewChecked {

  @ViewChild('inputField') inputField!: ElementRef<HTMLInputElement>;
  @Output() response = new EventEmitter();

  isEditing = false;
  epicName!: string;
  inputValue = '';
  private focusInput = false;

  constructor(private backlogSer: BacklogService, private layoutSer: LayoutService) { }

  toggleEdit(): void {
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

  updateValue(event: Event): void {
    this.inputValue = (event.target as HTMLInputElement).value;
  }

  createEpic(): void {

    if (this.inputValue.trim()) {
      this.epicName = this.inputValue;
      // const projectId = this.layoutSer.getProjectId();
      // this.backlogSer.createEpic(this.epicName, projectId || '').subscribe({
      //   next: (res: { status: boolean, result: Task }) => {
          
      //     this.response.emit(res.result);
      //   },
      //   error: (err) => {
      //     console.log(err, 'adfrerr');
      //   }
      // })
      this.inputValue = '';
    }
    this.isEditing = false;
  }

}
