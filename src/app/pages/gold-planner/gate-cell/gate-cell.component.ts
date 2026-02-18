import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tooltip } from "primeng/tooltip";

@Component({
  selector: 'app-gate-cell',
  standalone: true,
  imports: [NgFor, Tooltip, NgClass],
  templateUrl: './gate-cell.component.html',
  styleUrl: './gate-cell.component.scss'
})
export class GateCellComponent {
  @Input() gate!: any;
  @Input() character!: any;
  @Input() selectedDifficulty: string | null = null;

  @Output() difficultyChange = new EventEmitter<string>();

  goldIcon = "assets/type_rewards/universal/gold.png";

  selectDifficulty(diff: string) {
    this.difficultyChange.emit(diff);
  }

  get activeDetails() {
    if (!this.selectedDifficulty) return null;
    return this.gate.details.find((d: { difficulty: string | null; }) => d.difficulty === this.selectedDifficulty);
  }

  getGold(diff: any): number {
    return diff.rewards
      ?.filter((r: any) => r.type === 'Gold')
      .reduce((sum: number, r: any) => sum + r.amount, 0) ?? 0;
  }

  getBoundGold(diff: any): number {
    return diff.rewards
      ?.filter((r: any) => r.type === 'Bound Gold')
      .reduce((sum: number, r: any) => sum + r.amount, 0) ?? 0;
  }

  getTotalGold(diff: any): number {
    return this.getGold(diff) + this.getBoundGold(diff);
  }

  formatGoldTooltip(diff: any): string {
    const gold = this.getGold(diff);
    const bound = this.getBoundGold(diff);

    if (!gold && !bound) return 'No gold reward';

    if (gold && bound) {
      return `Unbound Gold: ${gold}\nBound Gold: ${bound}`;
    }

    if (gold) return `Unbound Gold: ${gold}`;
    return `Bound Gold: ${bound}`;
  }
}
