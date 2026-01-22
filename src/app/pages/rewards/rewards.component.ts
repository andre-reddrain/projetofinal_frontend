import { Component } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel } from "primeng/floatlabel"
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgFor, NgIf } from '@angular/common';
import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';
import { RewardsService } from '../../services/rewards/rewards.service';
import { RewardItemComponent } from "./reward-item/reward-item.component";

type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [InputNumberModule, SelectModule, CheckboxModule, FormsModule, ButtonModule, NgFor, FloatLabel, RewardItemComponent, NgIf],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})
export class RewardsComponent {
  typeRewards: any;
  gateDetailsData: any;
  rewardsData: any;
  rewardsToInsert: any;

  selectedTypeReward: any;

  severityMap: Record<string, ButtonSeverity> = {
    'Solo': "success",
    'Normal': "info",
    'Hard': "danger"
  }
  
  getSeverity(gateDetail: any): ButtonSeverity {
    return this.severityMap[gateDetail.difficulty]
  }

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

    this.rewardsService.getRewardsFromGateDetails(gateDetailsIds).subscribe((data: any) => {
      const rewardsData = data.map((reward: { typeRewardId: any; }) => ({
        ...reward,
        typeReward: this.typeRewards.find((tr: { id: any; }) => tr.id === reward.typeRewardId)
      }));

      // For testing only!
      this.rewardsData = Array.from({ length: 10 }, () =>
        rewardsData.map((r: any) => ({ ...r }))
      ).flat();

      console.log(this.rewardsData)
    })
  }
}

