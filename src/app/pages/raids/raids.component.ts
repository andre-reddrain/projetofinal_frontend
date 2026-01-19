import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RaidsService } from '../../services/raids.service';

interface Raid {
  name: string,
  type: string
}

@Component({
  selector: 'app-raids',
  standalone: true,
  imports: [ButtonModule, NgFor],
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  raidsData: any

  constructor(private raidService: RaidsService) {}

  ngOnInit() {
    this.raidService.raidList().subscribe((data: any) => {
      this.raidsData = data;
    })
  }
}
