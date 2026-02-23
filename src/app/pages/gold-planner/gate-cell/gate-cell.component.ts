import { NgClass, NgFor } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Tooltip } from "primeng/tooltip";
import { GateProgressState } from '../gold-planner.component';

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

  @Input() activeDetailsId: string | null = null;
  @Input() activeState: GateProgressState | null = null;

  @Output() activeDetailsChange = new EventEmitter<string>();
  @Output() stateChange = new EventEmitter<{
    characterId: string;
    gateDetailsId: string;
    takingGold?: boolean;
    buyExtraLoot?: boolean
  }>();

  goldIcon = "assets/type_rewards/universal/gold.png";

  // Output events
  selectDifficulty(details: any) {
    this.activeDetailsChange.emit(details.id);
  }

  onTakingGoldChange(event: Event) {
    if (!this.activeDetailsId) return;
    const checked = (event.target as HTMLInputElement).checked;

    this.stateChange.emit({
      characterId: this.character.id,
      gateDetailsId: this.activeDetailsId,
      takingGold: checked
    });
  }

  onBuyExtraLootChange(event: Event) {
    if (!this.activeDetailsId) return;
    const checked = (event.target as HTMLInputElement).checked;

    this.stateChange.emit({
      characterId: this.character.id,
      gateDetailsId: this.activeDetailsId,
      buyExtraLoot: checked
    });
  }

  get activeDetails(): any | null {
    if (!this.activeDetailsId) return null;

    // IMPORTANT: adjust `this.gate.details` if your data uses another name
    return this.gate?.details?.find((d: any) => d.id === this.activeDetailsId) ?? null;
  }

  // Gold Tooltip UI helpers
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
