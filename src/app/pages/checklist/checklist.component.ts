import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ProgressSpinner } from 'primeng/progressspinner';
import { ProgressBarModule } from 'primeng/progressbar';

// Services
import { CharacterService } from '../../services/character/character.service';
import { CharacterGateProgressService } from '../../services/character-gate-progress/character-gate-progress.service';
import { RaidsService } from '../../services/raids/raids.service';
import { CharacterRaidsService } from '../../services/character-raids/character-raids.service';

@Component({
  selector: 'app-checklist',
  standalone: true,
  imports: [TableModule, FormsModule, NgFor, NgIf, ProgressSpinner, ProgressBarModule],
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
  trackedByCharRaid = new Map<string, boolean>();

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
            this.buildTrackedRaidIds();
            this.applyRaidFilter();
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
    this.raidService.getAllRaidsWithGates().subscribe({
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

  private makeCharRaidKey(characterId: string, raidId: string) {
    return `${characterId}_${raidId}`;
  }

  // TODO make this change on the backend!
  buildTrackedRaidIds() {
    this.trackedRaidIds.clear();
    this.trackedByCharRaid.clear();

    for (const cr of this.characterRaids ?? []) {
      const key = this.makeCharRaidKey(cr.characterId, cr.raidId);
      const tracked = !!cr.tracked;

      this.trackedByCharRaid.set(key, tracked);

      if (tracked) {
        this.trackedRaidIds.add(cr.raidId);
      }
    }
  }

  isTrackedForCharacter(raidId: string, characterId: string): boolean {
    return this.trackedByCharRaid.get(this.makeCharRaidKey(characterId, raidId)) === true;
  }

  applyRaidFilter() {
    this.filteredRaids = (this.raids ?? []).filter((r: any) =>
      this.trackedRaidIds.has(r.id)
    )
  }

  getChecklistCount(raidId: string, characterId: string) {
    const selected = this.gateProgress.filter((p: any) =>
      p.characterId === characterId &&
      p.raidId === raidId &&
      p.selected === true
    );

    const done = selected.filter((p: any) => p.isCompleted === true).length;

    return { done, total: selected.length };
  }

  getPercent(done: number, total: number): number {
    if (!total) return 0;
    return Math.round((done / total) * 100);
  }

  completeProgress(raidId: string, characterId: string) {
    const selected = (this.gateProgress ?? []).filter((p: any) =>
      p.characterId === characterId &&
      p.raidId === raidId &&
      p.selected === true
    )
    .sort((a: any, b: any) => (a.gateNumber ?? 999) - (b.gateNumber ?? 999));

    if (selected.length === 0) return;

    const doneCount = selected.filter((p: any) => p.isCompleted === true).length;

    // If not all done: mark the next incomplete as completed
    if (doneCount < selected.length) {
      const gateProgress = selected.find((p: any) => p.isCompleted !== true);
      if (!gateProgress) return;

      // Update the gateProgress to Completed
      this.gateProgressService.setGateProgressCompleted(gateProgress.id, true).subscribe({
        next: () => {
          gateProgress.isCompleted = true;
        },
        error: (err: any) => {
          console.error(err);
        }
      })
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
