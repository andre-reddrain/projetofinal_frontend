import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

import { RewardItemComponent } from '../reward-item/reward-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-reward-list',
  standalone: true,
  imports: [RewardItemComponent, ButtonModule, NgFor, NgIf],
  templateUrl: './reward-list.component.html',
  styleUrl: './reward-list.component.scss'
})
export class RewardListComponent {
  @Input() rewardsData: any[] = [];
  @Input() rewardsToInsert: any[] = [];

  @Output() submitRewardsRequest = new EventEmitter<void>();
  @Output() removeRewardRequest = new EventEmitter<any>();

  onRemoveReward(reward: any, label: string) {
    this.removeRewardRequest.emit({ reward, label });
  }
}
