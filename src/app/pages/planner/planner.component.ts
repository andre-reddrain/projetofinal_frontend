import { Component, ElementRef, Host, HostListener, ViewChild } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';

import { CharacterRaidsService } from '../../services/character-raids/character-raids.service';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../services/auth/auth.service';
import { RaidsService } from '../../services/raids/raids.service';


@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [TableModule, NgFor, FormsModule, ButtonModule, NgIf, NgClass],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss'
})
export class PlannerComponent {
  // Database data
  characters: any;
  raids: any;
  characterRaids: any;

  characterRaidLookup = new Map<string, any>();
  characterRaidById = new Map<string, any>();
  originalRaidById = new Map<string, any>();

  changedToggles: { id: string; tracked: boolean }[] = [];

  // Table variables
  @ViewChild('tableContainer') tableContainer!: ElementRef;
  charWidth = 0;
  frozenWidth = 200;
  visibleCols = 6;

  constructor(
    private characterService: CharacterService,
    private authService: AuthService,
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
    const userId = this.authService.userId;
    if (!userId) return;

    // Load of Characters and Character Raids (chained)
    this.loadCharactersAndCharacterRaids();

    // Load of Raids
    this.loadRaids();
  }

  ngAfterViewInit() {
    this.calculateCharWidth();
  }

  // Database functions
  loadCharactersAndCharacterRaids() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (characters: any) => {
        this.characters = characters;

        // Load of Character Raids
        let characterIds = this.characters.map((c: { id: any; }) => c.id);

        this.characterRaidsService.getCharacterRaidsByCharacterIds(characterIds).subscribe({
          next: charRaids => {
            this.characterRaids = charRaids;
            this.buildLookups();
          },
          error: err => console.error(err)
        })
      },
      error: err => console.error(err)
    });
  }

  loadRaids() {
    this.raidService.getAllRaids().subscribe({
      next: (data: any) => {
        // console.log(data);
        this.raids = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  onSave() {
    if (this.changedToggles.length === 0) return;

    console.log(this.changedToggles);
    console.log("Vai atualizar!");
  }

  // UI functions
  buildLookups() {
    this.characterRaidLookup.clear();
    this.characterRaidById.clear();
    this.originalRaidById.clear();

    this.characterRaids.forEach((cr: { id:string; raidId: string; characterId: string; }) => {
      const key = this.makeKey(cr.raidId, cr.characterId);

      this.characterRaidLookup.set(key, cr);
      this.characterRaidById.set(cr.id, cr);
      this.originalRaidById.set(cr.id, structuredClone(cr));
    });
  }

  makeKey(raidId: string, characterId: string) {
    return `${raidId}_${characterId}`;
  }

  onToggle(event: Event, id: string) {
    const checked = (event.target as HTMLInputElement).checked;

    const record = this.characterRaidById.get(id);
    const original = this.originalRaidById.get(id);

    if (!record || !original) return;

    record.tracked = checked;

    const index = this.changedToggles.findIndex(t => t.id === id);

    if (checked !== original.tracked) {
      if (index === -1) {
        this.changedToggles.push({ id, tracked: checked });
      } else {
        this.changedToggles[index].tracked = checked;
      }
    } else if (index !== -1) {
      this.changedToggles.splice(index, 1);
    }
  }

  isChanged(id: string): boolean {
    return this.changedToggles.some(t => t.id === id)
  }

  getCharacterRaid(raidId: string, characterId: string) {
    return this.characterRaidLookup.get(this.makeKey(raidId, characterId));
  }

  calculateCharWidth() {
    const parentWidth = this.tableContainer.nativeElement.offsetWidth;
    this.charWidth = (parentWidth - this.frozenWidth) / this.visibleCols;
  }

  get limitedCharWidth() {
    return Math.min(this.charWidth, 250);
  }
}
