import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { NgFor, NgIf } from '@angular/common';
import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';
import { RewardsService } from '../../services/rewards/rewards.service';
import { RewardItemComponent } from "./reward-item/reward-item.component";
import { RewardFormComponent } from "./reward-form/reward-form.component";
import { RewardGateDetailsComponent } from "./reward-gate-details/reward-gate-details.component";

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [ButtonModule, NgFor, RewardItemComponent, NgIf, RewardFormComponent, RewardGateDetailsComponent],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
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
    private rewardsService: RewardsService
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
    console.log(reward)
    this.rewardsToInsert.push({
      ...reward,
      typeRewardId: reward.typeReward.id,
      gateDetailsId: this.selectedGateDetails.id
    })
  }

  submitRewards() {
    //TODO API call to add on batch
  }
}
