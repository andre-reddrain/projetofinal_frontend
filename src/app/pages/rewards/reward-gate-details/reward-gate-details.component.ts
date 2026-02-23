import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

type ButtonSeverity = 'success' | 'info' | 'warn' | 'danger' | 'help' | 'primary' | 'secondary' | 'contrast';

@Component({
  selector: 'app-reward-gate-details',
  standalone: true,
  imports: [NgFor, ButtonModule],
  templateUrl: './reward-gate-details.component.html',
  styleUrl: './reward-gate-details.component.scss'
})
export class RewardGateDetailsComponent {
  @Input() gateDetailsData!: any;
  
  @Output() gateDetailSelected = new EventEmitter<any>();

  severityMap: Record<string, ButtonSeverity> = {
    'Solo': "success",
    'Normal': "info",
    'Hard': "danger"
  }

  getSeverity(gateDetail: any): ButtonSeverity {
    return this.severityMap[gateDetail.difficulty]
  }

  selectGateDetail(gateDetail: any) {
    this.gateDetailSelected.emit(gateDetail)
  }
}
