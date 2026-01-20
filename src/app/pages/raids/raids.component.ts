import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RaidsService } from '../../services/raids/raids.service';
import { RaidDialogComponent } from "./raid-dialog/raid-dialog.component";

interface Raid {
  name: string,
  type: string
}

@Component({
  selector: 'app-raids',
  standalone: true,
  imports: [ButtonModule, NgFor, RaidDialogComponent],
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  raidsData: any;
  selectedRaid: any;

  // Dialog
  visible: boolean = false;

  showDialog(raid: any) {
    this.selectedRaid = raid;
    this.visible = !this.visible;
  }

  constructor(private raidService: RaidsService) {}

  ngOnInit() {
    this.raidService.raidListWithGates().subscribe((data: any) => {
      this.raidsData = data;
    })
  }
}
