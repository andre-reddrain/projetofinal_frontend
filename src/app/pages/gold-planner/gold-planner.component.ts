import { Component } from '@angular/core';
import { NgClass, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

// Services
import { GoldPlannerService } from '../../services/gold-planner/gold-planner.service';
import { CharacterService } from '../../services/character/character.service';
import { CharacterGateProgressService } from '../../services/character-gate-progress/character-gate-progress.service';
import { GateCellComponent } from "./gate-cell/gate-cell.component";

export type GateProgressState = {
  id: string | null;
  characterId: string;
  gateDetailsId: string;
  takingGold: boolean;
  buyExtraLoot: boolean;
  selected: boolean;
}

@Component({
  selector: 'app-gold-planner',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, TableModule, NgFor, ButtonModule, GateCellComponent, NgClass],
  templateUrl: './gold-planner.component.html',
  styleUrl: './gold-planner.component.scss'
})
export class GoldPlannerComponent {
  // Database data
  characters: any = [];
  raids: any = [];
  gateProgress: any = [];

  // Current live UI state
  progressByKey = new Map<string, GateProgressState>();

  // Snapshot from the Database
  originalByKey = new Map<string, GateProgressState>();

  // Contains what changed - Prepares for the Insert / Update
  changedByKey = new Map<string, GateProgressState>();

  // Map
  activeDetailsByGate = new Map<string, string>();

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

  //#region Database functions

  /**
   * Loads the Characters and their GateProgress
   */
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
            this.initializeActiveDetailsSelections();

            // console.log(gateProgress);
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

  /**
   * Loads the GoldPlanner settings
   */
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
        
        this.initializeActiveDetailsSelections();

        this.completeRequest();
      },
      error: err => {
        console.error(err);
        this.completeRequest();
      }
    })
  }

  /**
   * Makes the Insert / Update of the GateProgress
   */
  saveChanges() {
    const payload = this.getChangedPayload();

    if (payload.length === 0) return;

    this.gateProgressService.bulkUpsertGateProgress(payload).subscribe({
      next: () => {
        this.commitChanges();
      },
      error: (err: any) => {
        console.error(err);
      }
    })
  }

  //#endregion

  //#region Ordering functions

  getGateDetailsForCharacter(gate: any, characterId: string) {
    return gate.gateDetails
      .filter((d: { progress: { characterId: string; }; }) => d.progress?.characterId === characterId)
      .sort((a: { entryLvl: number; }, b: { entryLvl: number; }) => {
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

  //#endregion

  //#region State functions

  /**
   * Builds up the lookups maps.
   */
  buildLookups() {
    this.progressByKey.clear();
    this.originalByKey.clear();
    this.changedByKey.clear();

    for (const p of this.gateProgress) {
      const state: GateProgressState = {
        id: p.id ?? null,
        characterId: p.characterId,
        gateDetailsId: p.gateDetailsId,
        takingGold: !!p.takingGold,
        buyExtraLoot: !!p.buyExtraLoot,
        selected: !!p.selected
      }
  
      const key = this.makeKey(p.characterId, p.gateDetailsId);

      this.progressByKey.set(key, state);
      this.originalByKey.set(key, structuredClone(state))
    }
  }

  private initializeActiveDetailsSelections() {
    if (!this.raids?.length || !this.characters?.length) return;

    for (const raid of this.raids) {
      for (const gate of raid.gates) {
        for (const char of this.characters) {
          const gateKey = this.makeGateKey(char.id, gate.id);

          // Don't override user's current selection
          if (this.activeDetailsByGate.has(gateKey)) continue;

          // Find a details that is selected = true in the database
          const selectedDetails = gate.details?.find((d: any) => {
            const s = this.progressByKey.get(this.makeKey(char.id, d.id));
            return s?.selected === true;
          });

          if (selectedDetails) {
            this.setActiveDetailsId(char.id, gate.id, selectedDetails.id);
          }
          // else: leave null (no default selection)
        }
      }
    }
  }

  /**
   * Generates a key to bind Character and GateDetails - For the maps
   * @param characterId Character ID
   * @param gateDetailsId GateDetails ID
   * @returns Key: characterId_gateDetailsId
   */
  makeKey(characterId: string, gateDetailsId: string) {
    return `${characterId}_${gateDetailsId}`;
  }

  makeGateKey(characterId: string, gateId: string) {
    return `${characterId}_${gateId}`;
  }

  /**
   * Gets the existing GateProgress from the original map, or else, creates a new one
   * @param characterId Character ID
   * @param gateDetailsId GateDetails ID
   * @returns Existing GateProgress or new
   */
  getOrCreateState(characterId: string, gateDetailsId: string): GateProgressState {
    const key = this.makeKey(characterId, gateDetailsId);

    const existing = this.progressByKey.get(key);
    if (existing) return existing;

    // GateProgress does not exist. We are going to create it
    const created: GateProgressState = {
      id: null,
      characterId,
      gateDetailsId,
      takingGold: false,
      buyExtraLoot: false,
      selected: false
    };

    this.progressByKey.set(key, created);

    this.originalByKey.set(key, structuredClone(created));

    return created;
  }

  /**
   * Detects changes versus the original GateProgressState
   * @param state GateProgressState changed
   */
  private upsertChanged(state: GateProgressState) {
    const key = this.makeKey(state.characterId, state.gateDetailsId);
    const original = this.originalByKey.get(key);

    const changed =
      !original ||
      state.takingGold !== original.takingGold ||
      state.buyExtraLoot !== original.buyExtraLoot ||
      state.selected !== original.selected;

    if (changed) {
      this.changedByKey.set(key, structuredClone(state));
    } else {
      this.changedByKey.delete(key);
    }
  }

  isDirty(characterId: string, gateDetailsId: string): boolean {
    return this.changedByKey.has(this.makeKey(characterId, gateDetailsId));
  }

  onActiveDetailsChange(characterId: string, gateId: string, newDetailsId: string) {
    const oldDetailsId = this.getActiveDetailsId(characterId, gateId);

    if (oldDetailsId && oldDetailsId !== newDetailsId) {
      const oldState = this.getOrCreateState(characterId, oldDetailsId);

      oldState.selected = false;

      this.upsertChanged(oldState);
    }

    const newState = this.getOrCreateState(characterId, newDetailsId);
    newState.selected = true;
    this.upsertChanged(newState);

    this.setActiveDetailsId(characterId, gateId, newDetailsId);
  }

  onGateStateChange(patch: { characterId: string; gateDetailsId: string; takingGold?: boolean; buyExtraLoot?: boolean }) {
    const state = this.getOrCreateState(patch.characterId, patch.gateDetailsId);

    if (typeof patch.takingGold === 'boolean') state.takingGold = patch.takingGold;
    if (typeof patch.buyExtraLoot === 'boolean') state.buyExtraLoot = patch.buyExtraLoot;

    this.upsertChanged(state);
  }

  getChangedPayload(): GateProgressState[] {
    return Array.from(this.changedByKey.values())
  }

  commitChanges() {
    for (const [key, state] of this.changedByKey.entries()) {
      this.originalByKey.set(key, structuredClone(state));
    }
    this.changedByKey.clear();
  }

  //#endregion

  //#region Get / Set

  getActiveDetailsId(characterId: string, gateId: string): string | null {
    return this.activeDetailsByGate.get(this.makeGateKey(characterId, gateId)) ?? null;
  }

  setActiveDetailsId(characterId: string, gateId: string, gateDetailsId: string) {
    this.activeDetailsByGate.set(this.makeGateKey(characterId, gateId), gateDetailsId);
  }

  // Loading functions
  private completeRequest() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }

  //#endregion 
}
