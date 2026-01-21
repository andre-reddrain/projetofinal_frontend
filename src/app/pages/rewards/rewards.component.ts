import { Component } from '@angular/core';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { NgFor } from '@angular/common';
import { GateDetailsService } from '../../services/gate-details/gate-details.service';
import { TypeRewardsService } from '../../services/type-rewards/type-rewards.service';

type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

@Component({
  selector: 'app-rewards',
  standalone: true,
  imports: [InputNumberModule, SelectModule, CheckboxModule, FormsModule, ButtonModule, NgFor],
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

  getSeverity(gateDetail: any): ButtonSeverity {
    return this.severityMap[gateDetail.difficulty]
  }

  constructor(
    private gateDetailsService: GateDetailsService,
    private typeRewardsService: TypeRewardsService
  ) {}

  ngOnInit() {
    // Load of GateDetails
    this.gateDetailsService.getAllGateDetails().subscribe((data: any) => {
      this.gateDetailsData = data;
    })

    // Load of TypeRewards
    this.typeRewardsService.getAllTypeRewards().subscribe((data: any) => {
      this.typeRewards = data;
      console.log(this.typeRewards)
    })
  }
}
