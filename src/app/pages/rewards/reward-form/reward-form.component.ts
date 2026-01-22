import { NgIf, NgClass, NgStyle } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-reward-form',
  standalone: true,
  imports: [InputNumberModule, SelectModule, CheckboxModule, FormsModule, FloatLabel, ButtonModule, NgIf, NgStyle],
  templateUrl: './reward-form.component.html',
  styleUrl: './reward-form.component.scss'
})
export class RewardFormComponent {
  @Input() typeRewards!: any;
  @Input() selectedGateDetails!: any;

  @Output() submitReward = new EventEmitter<any>();

  // Vars of Form
  selectedTypeReward: any;
  quantity: any;
  isExtraReward: any = false;

  constructor(private cd: ChangeDetectorRef) {}

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  getDifficultyClass(difficulty: string): string {
    const map: Record<string, string> = {
      'Solo': '#4ade80',
      'Normal': '#38bdf8',
      'Hard': '#f87171'
    };

    return map[difficulty] || 'light-dark';
  }

  submit(form: any) {
    if (form.invalid || !this.selectedGateDetails) return;

    this.submitReward.emit({
      typeReward: this.selectedTypeReward,
      ammount: this.quantity,
      isExtraReward: this.isExtraReward
    });

    // Reset Form
    const selectedType = this.selectedTypeReward;

    form.resetForm({
      reward: selectedType,
      quantity: null,
      extraReward: false
    });
  }
}
