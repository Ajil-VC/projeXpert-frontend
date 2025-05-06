import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-epics',
  imports: [
    CommonModule
  ],
  templateUrl: './epics.component.html',
  styleUrl: './epics.component.css'
})
export class EpicsComponent {


  isHidden : boolean = false;
  epicCount = 2;

  // : Epic[]
  epics = [
    {
      id: '1',
      title: 'Epic',
      wishlists: ['Wishlist', 'Wishlist', 'Wishlist', 'Wishlist'],
      startDate: null,
      endDate: null
    }
  ];

  selectedEpic  = this.epics[0];

  toggleEpicDetails(epic :any ): void {
  }
  
  hideEpics(){
    this.isHidden = !this.isHidden;

  }

  createNewEpic(): void {
    // Logic to create a new epic
  }


}
