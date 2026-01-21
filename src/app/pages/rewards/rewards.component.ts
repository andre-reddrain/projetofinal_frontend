import { Component } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel } from "primeng/floatlabel"
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgFor } from '@angular/common';
import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';
import { RewardsService } from '../../services/rewards/rewards.service';

type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [InputNumberModule, SelectModule, CheckboxModule, FormsModule, ButtonModule, NgFor, FloatLabel],
  templateUrl: './rewards.component.html',
  styleUrl: './rewards.component.scss'
})
export class RewardsComponent {
  typeRewards: any;
  gateDetailsData: any;

  severityMap: Record<string, ButtonSeverity> = {
    'Solo': "success",
    'Normal': "warn",
    'Hard': "danger"
  }
selectedTypeReward: any;

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
      console.log(data);
    })
  }
}
