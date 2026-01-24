import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from "@angular/router";
import { ButtonModule } from 'primeng/button';
import { LoginComponent } from "../pages/login/login.component";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [Menubar, BadgeModule, ButtonModule, RouterLink, LoginComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  items: MenuItem[] | undefined;
  username = "Username"

  visible: boolean = false;

  showDialog() {
      this.visible = !this.visible;
  }

  closeDialog() {
      this.visible = false;
  }  
}
