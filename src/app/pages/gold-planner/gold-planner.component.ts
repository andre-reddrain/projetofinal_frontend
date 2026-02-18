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
import { CharacterGateProgressService } from '../../services/character-gate-progress/character-gate-progress.service';
import { GateCellComponent } from "./gate-cell/gate-cell.component";

@Component({
  selector: 'app-gold-planner',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, TableModule, NgFor, ButtonModule, TooltipModule, GateCellComponent],
  templateUrl: './gold-planner.component.html',
  styleUrl: './gold-planner.component.scss'
})
export class GoldPlannerComponent {
  // Database data
  characters: any = [];
  raids: any = [];
  gateProgress: any = [];

  progressLookup = new Map<string, any>();
  progressById = new Map<string, any>();
  originalProgressById = new Map<string, any>();

  /**
   * Keeps selected difficulties after row collapse
   */
  selectedDifficultyMap = new Map<string, string>();

  // Table variables
  expandedRows = {};
  
  loading = true;
  pendingRequests = 2;  

  constructor(
    private characterService: CharacterService,
    private goldPlannerService: GoldPlannerService,
    private gateProgressService: CharacterGateProgressService
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
     this.loadCharactersAndGateProgress();

     // Load Gold Planner Data
     this.loadGoldPlanner();
  }

  // Database functions
  loadCharactersAndGateProgress() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (characters: any) => {
        this.characters = characters;

        if (this.characters.length === 0) {
          this.completeRequest();
          return;
        }

        // Collect Character Gate Progress
        let characterIds = this.characters.map((c: { id: any; }) => c.id);

        this.gateProgressService.getCharacterGateProgressByCharacterIds(characterIds).subscribe({
          next: gateProgress => {
            this.gateProgress = gateProgress;

            this.buildLookups();

            console.log(gateProgress);
            this.completeRequest();
          },
          error: err => {
            console.error(err);
            this.completeRequest();
          }
        })
      },
      error: err => {
        console.error(err);
        this.completeRequest();
      }
    })
  }

  loadGoldPlanner() {
    this.goldPlannerService.getGoldPlanner().subscribe({
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
        this.completeRequest();
      },
      error: err => {
        console.error(err);
        this.completeRequest();
      }
    })
  }

  // Ordering functions
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

  // UI functions
  buildLookups() {
    this.progressLookup.clear();
    this.progressById.clear();
    this.originalProgressById.clear();

    this.gateProgress.forEach((p: any) => {
      const key = this.makeKey(p.gateDetailsId, p.characterId);

      this.progressLookup.set(key, p);
      this.progressById.set(p.id, p);
      this.originalProgressById.set(p.id, structuredClone(p))
    })
  }

  makeKey(gateDetailsId: string, characterId: string) {
    return `${gateDetailsId}_${characterId}`;
  }

  getProgress(detailsId: string, characterId: string) {
    return this.progressLookup.get(this.makeKey(detailsId, characterId));
  }

  // selectedDifficultyMap functions
  makeDifficultyKey(gateId: string, characterId: string) {
    return `${gateId}_${characterId}`;
  }

  getSelectedDifficulty(gateId: string, characterId: string) {
    return this.selectedDifficultyMap.get(this.makeDifficultyKey(gateId, characterId)) ?? null;
  }

  setSelectedDifficulty(gateId: string, characterId: string, diff: string) {
    this.selectedDifficultyMap.set(this.makeDifficultyKey(gateId, characterId), diff);
  }

  // Loading functions
  private completeRequest() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }
}
