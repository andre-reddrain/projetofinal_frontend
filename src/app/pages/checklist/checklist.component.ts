import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { CharacterGateProgressService } from '../../services/character-gate-progress/character-gate-progress.service';
import { RaidsService } from '../../services/raids/raids.service';
import { ProgressSpinner } from 'primeng/progressspinner';
import { TableModule } from 'primeng/table';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { CharacterRaidsService } from '../../services/character-raids/character-raids.service';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [TableModule, FormsModule, NgFor, NgIf, ProgressSpinner],
  templateUrl: './checklist.component.html',
  styleUrl: './checklist.component.scss'
})
export class ChecklistComponent {
  // Database data
  characters: any = [];
  raids: any = [];
  gateProgress: any = [];
  characterRaids: any;

  // Table data
  trackedRaidIds = new Set<string>();
  filteredRaids: any[] = [];

  // Loading variables
  loading = true;
  pendingRequests = 2;

  constructor(
    private characterService: CharacterService,
    private gateProgressService: CharacterGateProgressService,
    private raidService: RaidsService,
    private characterRaidsService: CharacterRaidsService
  ) {}

  private raidIcons: Record<string, string> = {
    'Abyss Raid': 'assets/icons/abyssal-raid.webp',
    'Legion Raid': 'assets/icons/legion_raid.png',
    'Abyssal Dungeon': 'assets/icons/abyssal-dungeon.webp',
    'Epic Raid': 'assets/icons/dungeon.webp',
    'Kazeros Raid': 'assets/icons/kazeros_raid.webp'
  }

  getRaidIcon(type: string): string {
    return this.raidIcons[type] || '';
  }

  ngOnInit() {
    // Load Characters
    this.loadCharactersAndGateProgress();

    // Load Raids
    this.loadRaids();
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

            // this.buildLookups();

            console.log(gateProgress);
            this.completeRequest();
          },
          error: err => {
            console.error(err);
            this.completeRequest();
          }
        });

        // Collect Character Raids
        this.characterRaidsService.getCharacterRaidsByCharacterIds(characterIds).subscribe({
          next: charRaids => {
            this.characterRaids = charRaids;
            // this.buildLookups();
            this.buildTrackedRaidIds();
            this.applyRaidFilter();
            this.generateRandomChecklist();
            this.completeRequest();
          },
          error: err => {
            console.error(err);
            this.completeRequest();
          }
        });
      },
      error: err => {
        console.error(err);
        this.completeRequest();
      }
    });
  }

  loadRaids() {
    this.raidService.getAllRaids().subscribe({
      next: (data: any) => {
        this.raids = data;
        this.applyRaidFilter();
        this.completeRequest();
      },
      error: err => {
        console.error(err);
        this.completeRequest();
      }
    })
  }

  // TODO make this change on the backend!
  buildTrackedRaidIds() {
    this.trackedRaidIds.clear();

    for (const cr of this.characterRaids) {
      if (cr.tracked) {
        this.trackedRaidIds.add(cr.raidId);
      }
    }
  }

  applyRaidFilter() {
    this.filteredRaids = (this.raids ?? []).filter((r: any) =>
      this.trackedRaidIds.has(r.id)
    )
  }

  randomChecklist = new Map<string, { done: number; total: number }>();

  private makeKey(raidId: string, characterId: string) {
    return `${raidId}_${characterId}`;
  }

  private generateRandomChecklist() {
    this.randomChecklist.clear();

    for (const raid of this.filteredRaids ?? []) {
      for (const char of this.characters ?? []) {

        const total = Math.floor(Math.random() * 3) + 1; // 1 to 3
        const done = Math.floor(Math.random() * (total + 1)); // 0 to total

        this.randomChecklist.set(
          this.makeKey(raid.id, char.id),
          { done, total }
        );
      }
    }
  }

  // Loading functions
  private completeRequest() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.loading = false;
    }
  }
}
