import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { HeaderConfig } from '../../../core/domain/entities/UI Interface/header.interface';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { boardSwitcher, ButtonType } from '../../../core/domain/entities/UI Interface/button.interface';
import { debounceTime, distinctUntilChanged, startWith, Subject, takeUntil } from 'rxjs';
import { Button, ReportFilter, SelectedFilter } from '../../../core/domain/entities/UI Interface/headerTypes';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NotificationService } from '../../../core/data/notification.service';


interface params {
  selected?: SelectedFilter,
  selectedOption?: string
}

@Component({
  selector: 'app-content-header',
  imports: [FormsModule, CommonModule, ReactiveFormsModule,
    MatDatepickerModule
  ],
  templateUrl: './content-header.component.html',
  styleUrl: './content-header.component.css'
})
export class ContentHeaderComponent {

  @Output() searchQuery = new EventEmitter();
  @Output() buttonClicked = new EventEmitter<ButtonType>();
  clickedBtn!: ButtonType;
  searchControl = new FormControl('');
  custom: boolean = false;
  private destroy$ = new Subject<void>();
  hideSearchBar: boolean = false;

  @Input() headerConfig: HeaderConfig = {
    title: 'Loading...',
    subtitle: 'Loading...',
    searchQuery: '',
    hideSearchBar: false,
    placeHolder: 'Loading...'
  };


  viewMode: 'grid' | 'list' = 'grid';
  filter: ReportFilter = 'year';
  boardView: boardSwitcher = {
    viewType: 'board'
  }

  statusFilters = {
    active: true,
    archived: false,
    completed: false
  };

  constructor(private toast: NotificationService) { }

  startDateValue: string = '';
  endDateValue: string = '';

  // Handle date selection
  onStartDateChange(date: any) {
    this.startDateValue = date ? date.toLocaleDateString() : '';
  }

  onEndDateChange(date: any) {
    this.endDateValue = date ? date.toLocaleDateString() : '';
  }

  getButton(type: string) {
    const isBtn = this.headerConfig.buttons?.find((btn: ButtonType) => {
      return btn.type === type;
    });

    return isBtn;
  }
  buttonHasPermission(type: string) {
    const btn = this.headerConfig.buttons?.find((b: ButtonType) => {
      return b.type === type;
    });

    return btn?.restriction || false;
  }

  searchTerm$ = this.searchControl.valueChanges.pipe(
    startWith(''),
    debounceTime(300),
    distinctUntilChanged(),
    takeUntil(this.destroy$)
  ).subscribe(searchTerm => {
    const term = searchTerm?.toLowerCase().trim();
    this.searchQuery.emit(term);

  })

  get dropDownData() {
    const btn = this.headerConfig.buttons?.find((btn: ButtonType) => {
      return btn.type === 'dropdown';
    });
    if (btn && btn?.dropDownData) {
      return btn.dropDownData;
    }
    return [];
  }


  onButtonClick(type: Button, params?: params) {

    const { selected, selectedOption } = params || {};

    if (type === 'main') {
      this.clickedBtn = {
        triggeredFor: this.headerConfig.title,
        type: 'main'
      }
    } else if (type === 'select') {
      if (selected) {
        if (selected === 'board' || selected === 'sprint_report') {
          this.boardView.viewType = selected;
         this.clickedBtn = {
          triggeredFor :this.headerConfig.title,
          type:'select',
          action:{
            viewType: selected
          }
         }
        }
      }

    } else if (type === 'filter') {
      if (selected) {
        if (selected === 'active' || selected === 'archived' || selected === 'completed') {

          this.statusFilters[selected] = !this.statusFilters[selected];
          this.clickedBtn = {
            triggeredFor: this.headerConfig.title,
            type: 'filter',
            action: {
              statusFilters: this.statusFilters
            }
          }

        }

      }
    } else if (type === 'view') {
      if (selected === 'grid' || selected === 'list') {

        this.viewMode = selected;
        this.clickedBtn = {
          triggeredFor: this.headerConfig.title,
          type: 'view',
          action: {
            viewMode: selected
          }
        }

      }
    } else if (type === 'radio') {

      if (selected === 'year' || selected === 'month' || selected === 'custom' || selected === 'date') {

        if (selected === 'custom') {
          this.custom = !this.custom;
          this.filter = selected;

          if (this.custom) {
            return;
          }
        } else if (selected === 'date') {

          const startDate = new Date(this.startDateValue);
          const endDate = new Date(this.endDateValue);

          if (startDate > endDate) {
            this.toast.showError('Please give proper start date and end date.');
            return;
          }


          this.filter = selected;
          this.clickedBtn = {
            triggeredFor: this.headerConfig.title,
            type: 'radio',
            action: {
              filter: selected,
              startDate: startDate,
              endDate: endDate
            }
          }

        } else if (selected === 'month' || selected === 'year') {

          this.filter = selected;
          this.clickedBtn = {
            triggeredFor: this.headerConfig.title,
            type: 'radio',
            action: {
              filter: selected
            }
          }

        }

      }

    } else if (type === 'dropdown') {

      this.clickedBtn = {
        triggeredFor: this.headerConfig.title,
        type: 'dropdown',
        selectedOption
      }
    } else {
      return;
    }

    this.buttonClicked.emit(this.clickedBtn);
  }


  onSelection(event: Event) {

    const selected = (event.target as HTMLSelectElement).value;
    this.onButtonClick('dropdown', { selectedOption: selected });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
