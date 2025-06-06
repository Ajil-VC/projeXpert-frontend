import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forbidden-403',
  imports: [],
  templateUrl: './forbidden-403.component.html',
  styleUrl: './forbidden-403.component.css'
})
export class Forbidden403Component {

  message = "You don't have permission to access this page.";

  constructor(private router: Router) {

    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras?.state as { message?: string; code?: string };

    if (state?.message) {
      this.message = state.message;
    }

  }
  goToLogin() {
    this.router.navigate(['/login']);
  }

}
