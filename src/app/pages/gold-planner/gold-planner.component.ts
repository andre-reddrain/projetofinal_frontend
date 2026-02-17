import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// Services
import { GoldPlannerService } from '../../services/gold-planner/gold-planner.service';
import { CharacterService } from '../../services/character/character.service';
import { TooltipModule } from "primeng/tooltip";

@Component({
  selector: 'app-gold-planner',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, TableModule, NgFor, ButtonModule, TooltipModule],
  templateUrl: './gold-planner.component.html',
  styleUrl: './gold-planner.component.scss'
})
export class GoldPlannerComponent {
  // Database data
  characters: any = [];
  raids: any = [];
  
  loading = false;
  expandedRows = {};

  goldIcon = "assets/type_rewards/universal/gold.png";

  constructor(
    private characterService: CharacterService,
    private goldPlannerService: GoldPlannerService
  ) {}

  private raidIcons: Record<string, string> = {
    'Abyss Raid': 'assets/icons/abyssal-raid.webp',
    'Legion Raid': 'assets/icons/legion_raid.png',
    'Abyssal Dungeon': 'assets/icons/abyssal-dungeon.webp',
    'Epic Raid': 'assets/icons/dungeon.webp',
    'Kazeros Raid': 'assets/icons/kazeros_raid.webp'
  }

  private difficultyOrder: Record<string, number> = {
    'Solo': 1,
    'Normal': 2,
    'Hard': 3
  };

  private rewardOrder: Record<string, number> = {
    'Gold': 1,
    'Bound Gold': 2
  }

  getRaidIcon(type: string): string {
    return this.raidIcons[type] || '';
  }

  ngOnInit() {
     // Load Characters
     this.loadCharacters();
  }

  loadCharacters() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (characters: any) => {
        this.characters = characters;

        // Temp - testing the endpoint!
        this.goldPlannerService.getGoldPlanner(characters[0].id).subscribe({
          next: (data: any) => {
            this.raids = data.raids;

            // Order gates by number
            this.raids.forEach((raid: { gates: any[]; }) => {
                raid.gates.sort((a, b) => a.number - b.number);

                raid.gates.forEach((gate: any) => {
                  // Sort difficulties
                  gate.details = this.organizeDifficulties(gate.details);

                  gate.details.forEach((details: any) => {
                    // Sort rewards
                    details.rewards = this.organizeRewards(details.rewards);
                  })
                })
            });
            console.log(this.raids);
          }
        })
      }
    })
  }

  getGateDetailsForCharacter(gate: any, characterId: string) {
    // Each gate has gateDetails
    // Each gateDetail has progress for each character
    return gate.gateDetails
      .filter((d: { progress: { characterId: string; }; }) => d.progress?.characterId === characterId)
      .sort((a: { entryLvl: number; }, b: { entryLvl: number; }) => {
        // Optional: sort by difficulty or entryLvl
        return a.entryLvl - b.entryLvl;
    });
  }

  organizeDifficulties(difficulties: any[]): any[] {
    return difficulties.slice().sort((a, b) => {
      const aOrder = this.difficultyOrder[a.difficulty] || 99;
      const bOrder = this.difficultyOrder[b.difficulty] || 99;
      return aOrder - bOrder;
    });
  }

  organizeRewards(rewards: any[]): any[] {
    return rewards.slice().sort((a, b) => {
      const aOrder = this.rewardOrder[a.type] || 99;
      const bOrder = this.rewardOrder[b.type] || 99;
      return aOrder - bOrder;
    })
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
