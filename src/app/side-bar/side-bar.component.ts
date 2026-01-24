import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuModule, DrawerModule, PanelMenuModule, RouterModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Characters', icon: 'pi pi-user', routerLink: '/characters' },
      { label: 'Raids', icon: 'pi pi-plus', routerLink: '/raids' },
      { label: 'Activities', icon: 'pi pi-plus', routerLink: '/activities' },
      { label: 'Rewards', icon: 'pi pi-plus', routerLink: '/rewards' },
      { label: 'Character Classes', icon: 'pi pi-plus', routerLink: '/character-classes' }
      // More sidebar items here...
    ]
  }
}
