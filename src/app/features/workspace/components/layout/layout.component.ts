import { Component } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../auth/data/auth.service';
import { SharedService } from '../../../../shared/services/shared.service';


@Component({
  selector: 'app-layout',
  imports: [SidebarComponent, HeaderComponent, RouterOutlet],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css'
})
export class LayoutComponent {

  constructor(private authService: AuthService, private shared: SharedService) { }

  ngOnInit() {

    //Fetching Teammembers 
    this.shared.fetchTeamMembers();

  }

}
