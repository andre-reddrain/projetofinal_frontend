import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { BadgeModule } from 'primeng/badge';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [Menubar, BadgeModule, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  items: MenuItem[] | undefined;
  username = "Username"

  ngOnInit() {
    this.items = [
      // {
      //   label: 'Home',
      //   icon: 'pi pi-home'
      // },
    ];
  }
}
