import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { RouterModule } from '@angular/router';
import { NgFor } from '@angular/common';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [RouterModule, NgFor],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      {
        label: 'Gold Planner',
        icon: 'assets/type_rewards/universal/gold.png',
        routerLink: '/'
      },
      {
        label: 'Characters',
        icon: 'assets/classes/fighter/wardancer.png',
        routerLink: '/characters'
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
        routerLink: '/rewards'
      },
      {
        label: 'Character Classes', 
        icon: 'assets/classes/assassin/deathblade.png', 
        routerLink: '/character-classes'
      }
    ]
  }
}
