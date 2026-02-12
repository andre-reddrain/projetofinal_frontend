import { Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from "@angular/forms";
import { AuthService } from '../../services/auth/auth.service';

interface SidebarItem {
  label: string;
  icon: string;
  routerLink: string;
  roles?: string[]
}

@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, NgFor, NgIf, FormsModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  items: SidebarItem[] | undefined;

  constructor(public authService: AuthService) {}

  ngOnInit() {
    this.items = [
      {
        label: 'Tracker (Name WIP)',
        icon: 'assets/icons/weekly.webp',
        routerLink: '/',
        roles: ['ADMIN', 'USER']
      },
      {
        label: 'Characters',
        icon: 'assets/classes/fighter/wardancer.png',
        routerLink: '/characters',
        roles: ['ADMIN', 'USER']
      },
      {
        label: 'Raids',
        icon: 'assets/icons/kazeros_raid.webp',
        routerLink: '/raids'
      },
      {
        label: 'Activities',
        icon: 'assets/icons/dungeon.webp',
        routerLink: '/activities'
      },
      {
        label: 'Rewards',
        icon: 'assets/type_rewards/honing/t4/destiny_destruction_stone.png',
        routerLink: '/rewards',
        roles: ['ADMIN']
      },
      // {
      //   label: 'Character Classes', 
      //   icon: 'assets/classes/assassin/deathblade.png', 
      //   routerLink: '/character-classes',
      //   roles: ['ADMIN']
      // }
      {
        label: 'Gold Planner',
        icon: 'assets/type_rewards/universal/gold.png',
        routerLink: '/planner',
        roles: ['ADMIN', 'USER']
      },
    ]
  }
}
