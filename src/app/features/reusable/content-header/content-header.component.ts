import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderConfig } from '../../../core/domain/entities/UI Interface/header.interface';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonType } from '../../../core/domain/entities/UI Interface/button.interface';

@Component({
  selector: 'app-content-header',
  imports: [FormsModule, CommonModule],
  templateUrl: './content-header.component.html',
  styleUrl: './content-header.component.css'
})
export class ContentHeaderComponent {

  @Output() searchQuery = new EventEmitter();
  @Output() buttonClicked = new EventEmitter<ButtonType>();
  clickedBtn!: ButtonType;
  @Input() headerConfig: HeaderConfig = {
    title: 'Loading...',
    subtitle: 'Loading...',
    searchQuery: '',
    placeHolder: 'Loading...'
  };


  viewMode: 'grid' | 'list' = 'grid';

  statusFilters = {
    active: true,
    archived: false,
    completed: false
  };

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    this.searchQuery.emit(value);
  }

  getButton(type: string) {
    const isBtn = this.headerConfig.buttons?.find((btn: ButtonType) => {
      return btn.type === type;
    });

    return isBtn;
  }

  onButtonClick(type: 'main' | 'view' | 'filter', selected?: 'active' | 'archived' | 'completed' | 'grid' | 'list') {

    if (type === 'main') {
      this.clickedBtn = {
        triggeredFor: this.headerConfig.title,
        type: 'main'
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
    } else {
      return;
    }

    this.buttonClicked.emit(this.clickedBtn);
  }



}
