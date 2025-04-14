import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {

  title = 'projex';
  isNavbarActive = false;
  
  toggleNavBar(): void{

    this.isNavbarActive = !this.isNavbarActive;
  }
}
