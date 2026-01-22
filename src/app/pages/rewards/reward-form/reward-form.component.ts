import { NgIf } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabel } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-reward-form',
  standalone: true,
  imports: [InputNumberModule, SelectModule, CheckboxModule, FormsModule, FloatLabel, ButtonModule, NgIf],
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

  submit(form: any) {
    // console.log(form)
    if (form.invalid || !this.selectedGateDetails) return;

    this.submitReward.emit({
      typeReward: this.selectedTypeReward,
      ammount: this.quantity,
      isExtraReward: this.isExtraReward
    });

    form.resetForm();
  }
}
