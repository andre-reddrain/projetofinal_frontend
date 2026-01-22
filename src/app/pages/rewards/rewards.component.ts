import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';
import { RewardsService } from '../../services/rewards/rewards.service';
import { RewardItemComponent } from "./reward-item/reward-item.component";
import { RewardFormComponent } from "./reward-form/reward-form.component";
import { RewardGateDetailsComponent } from "./reward-gate-details/reward-gate-details.component";

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [ButtonModule, ToastModule, NgFor, RewardItemComponent, NgIf, RewardFormComponent, RewardGateDetailsComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss',
  providers: [MessageService]
})
export class RewardsComponent {
  typeRewards: any;
  gateDetailsData: any;
  rewardsData: any;
  rewardsToInsert: any[] = [];

  selectedTypeReward: any;
  selectedGateDetails: any = null;

  constructor(
    private gateDetailsService: GateDetailsService,
    private typeRewardsService: TypeRewardsService,
    private rewardsService: RewardsService,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    // Load of GateDetails
    this.gateDetailsService.getAllGateDetails().subscribe((data: any) => {
      this.gateDetailsData = data;
    })

    // Load of TypeRewards
    this.typeRewardsService.getAllTypeRewards().subscribe((data: any) => {
      this.typeRewards = data;
      this.selectedTypeReward = this.typeRewards[0]
      // console.log(this.typeRewards)
    })
  }

  loadRewards(gateDetail: any) {
    let gateDetailsIds = [gateDetail.id]

    this.selectedGateDetails = gateDetail;

    this.rewardsService.getRewardsFromGateDetails(gateDetailsIds).subscribe((data: any) => {
      const rewardsData = data.map((reward: { typeRewardId: any; }) => ({
        ...reward,
        typeReward: this.typeRewards.find((tr: { id: any; }) => tr.id === reward.typeRewardId)
      }));

      this.rewardsData = rewardsData;

      // Reset rewardsToInsert
      this.rewardsToInsert = [];
    })
  }

  onRewardAdded(reward: any) {
    this.rewardsToInsert.push({
      ...reward,
      typeRewardId: reward.typeReward.id,
      gateDetailsId: this.selectedGateDetails.id
    })

    // console.log(this.rewardsToInsert)
  }

  submitRewards() {
    if (this.rewardsToInsert.length === 0) return;

    const payload = this.rewardsToInsert.map(r => ({
      ammount: r.ammount,
      isExtraReward: r.isExtraReward,
      gateDetailsId: r.gateDetailsId,
      typeRewardId: r.typeRewardId
    }));

    this.rewardsService.createRewardsBulk(payload).subscribe({
      next: () => {
        this.showSuccess();
        this.loadRewards(this.selectedGateDetails)
        this.rewardsToInsert = [];
      },
      error: err => {
        this.showError();
        console.error(err);
      }
    });
  }

  // Toast Functions
  showSuccess() {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Rewards successfully created!'});
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating rewards!'});
  }
}
