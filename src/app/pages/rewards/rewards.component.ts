import { Component } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';
import { RewardsService } from '../../services/rewards/rewards.service';
import { RewardFormComponent } from "./reward-form/reward-form.component";
import { RewardGateDetailsComponent } from "./reward-gate-details/reward-gate-details.component";
import { RewardListComponent } from "./reward-list/reward-list.component";

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [ButtonModule, ToastModule, RewardFormComponent, RewardGateDetailsComponent, RewardListComponent],
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

  private classOrder: Record<string, number> = {
    'Raid Drop': 1,
    'Honing Material': 2,
    'Accessory': 3,
    'Bracelet': 4,
    'Ability Stone': 5,
    'Currency': 6
  };

  ngOnInit() {
    // Load of GateDetails
    this.gateDetailsService.getAllGateDetails().subscribe((data: any) => {
      this.gateDetailsData = data;
    })

    // Load of TypeRewards
    this.typeRewardsService.getAllTypeRewards().subscribe((data: any) => {
      this.typeRewards = data;
      this.selectedTypeReward = this.typeRewards[0]
    })
  }

  organizeRewards(rewards: any[]): any[] {
    return rewards.slice().sort((a, b) => {
      const aOrder = this.classOrder[a.typeReward?.classType] || 99;
      const bOrder = this.classOrder[b.typeReward?.classType] || 99;
      return aOrder - bOrder;
    });
  }

  canAddReward(newReward: any): boolean {
    return !this.rewardsToInsert.some(r =>
      r.typeReward.id === newReward.typeReward.id &&
      r.isExtraReward === newReward.isExtraReward
    );
  }

  onRewardAdded(reward: any) {
    this.rewardsToInsert.push({
      ...reward,
      typeRewardId: reward.typeReward.id,
      gateDetailsId: this.selectedGateDetails.id
    })

    this.rewardsToInsert = this.organizeRewards(this.rewardsToInsert);
  }

  ///////////////
  // API Calls //
  ///////////////

  loadRewards(gateDetail: any) {
    let gateDetailsIds = [gateDetail.id]

    this.selectedGateDetails = gateDetail;

    this.rewardsService.getRewardsFromGateDetails(gateDetailsIds).subscribe((data: any) => {
      const rewardsData = data.map((reward: { typeRewardId: any; }) => ({
        ...reward,
        typeReward: this.typeRewards.find((tr: { id: any; }) => tr.id === reward.typeRewardId)
      }));

      this.rewardsData = rewardsData;

      this.rewardsData = this.organizeRewards(this.rewardsData);

      // Reset rewardsToInsert
      this.rewardsToInsert = [];
    })
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
        this.showSuccess('Rewards successfully created!');
        this.loadRewards(this.selectedGateDetails)
        this.rewardsToInsert = [];
      },
      error: err => {
        this.showError();
        console.error(err);
      }
    });
  }

  removeReward({ reward, label } : { reward: any; label: string }) {
    if (label === 'rewardToInsert') {
      this.rewardsToInsert = this.rewardsToInsert.filter(r => r !== reward);
      this.showSuccess('Reward removed from ' + label);
    } else if (label === 'rewardsData') {
      // Vai fazer a remoção na base de dados!
    }
    
  }

  /////////////////////
  // Toast Functions //
  /////////////////////

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message});
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error creating rewards!'});
  }
}
