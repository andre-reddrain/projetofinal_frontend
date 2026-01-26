import { Component } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from "@angular/router";

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';

import { LoginComponent } from "../pages/login/login.component";

import { AuthService } from '../services/auth/auth.service';


@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf, MenuModule, Menubar, BadgeModule, ButtonModule, RouterLink, LoginComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  userOptions: MenuItem[] | undefined;
  username: string | null = null;

  visible: boolean = false;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.username = this.authService.currentUser?.username ?? null;

    this.userOptions = [
      { label: 'Sign out', icon: 'pi pi-sign-out', command: () => this.authService.logout(), styleClass: 'sign-out-item' }
    ]
  }

  // Login Dialog Methods
  showLoginDialog() {
      this.visible = !this.visible;
  }

  closeDialog() {
      this.visible = false;
  }  
}
