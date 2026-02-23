import { NgIf, NgStyle } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-reward-item',
  standalone: true,
  imports: [TooltipModule, ConfirmPopupModule, NgIf, NgStyle],
  providers: [ConfirmationService],
  templateUrl: './reward-item.component.html',
  styleUrl: './reward-item.component.scss'
})
export class RewardItemComponent {
  @Input() reward!: any;
  @Input() showExtraLabel = false;

  @Output() removeReward = new EventEmitter<any>();

  constructor(private confirmationService: ConfirmationService) {}

  private background: Record<string, string> = {
    'Normal': 'assets/background/normal.png',
    'Uncommon': 'assets/background/uncommon.png',
    'Rare': 'assets/background/rare.png',
    'Epic': 'assets/background/epic.png',
    'Legendary': 'assets/background/legendary.png',
    'Relic': 'assets/background/relic.png',
    'Ancient': 'assets/background/ancient.png',
    'Sidereal': 'assets/background/sidereal.png',
  }

  getBackgroundImage(grade: string): string {
    return this.background[grade] || '';
  }

  confirmRemove(event: Event) {
    // console.log(reward);
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete this reward ('+ this.reward.typeReward.name + ')?',
      icon: 'pi pi-info-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.removeReward.emit(this.reward);
      }
    });
  }
}
