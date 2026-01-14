import { Component } from '@angular/core';

import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DrawerModule } from 'primeng/drawer';
import { PanelMenuModule } from 'primeng/panelmenu';


@Component({
  selector: 'app-side-bar',
  standalone: true,
  imports: [MenuModule, DrawerModule, PanelMenuModule],
  templateUrl: './side-bar.component.html',
  styleUrl: './side-bar.component.scss',
})
export class SideBarComponent {
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [
      { label: 'Characters', icon: 'pi pi-user'},
      { label: 'Raids', icon: 'pi pi-plus' }
      // More sidebar items here...
    ]
  }
}
