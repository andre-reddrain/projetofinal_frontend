import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-reward-item',
  standalone: true,
  imports: [TooltipModule, NgIf],
  templateUrl: './reward-item.component.html',
  styleUrl: './reward-item.component.scss'
})
export class RewardItemComponent {
  @Input() reward!: any;
  @Input() showExtraLabel = false;
}
