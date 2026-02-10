import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../services/auth/auth.service';
import { RaidsService } from '../../services/raids/raids.service';

import { TableModule } from 'primeng/table';
import { CharacterRaidsService } from '../../services/character-raids/character-raids.service';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss'
})
export class PlannerComponent {
  characters: any;
  raids: any;
  characterRaids: any;

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

  // getRaidIcon(grade: string): string {
  //   return this.background[grade] || '';
  // }

  ngOnInit() {
    const userId = this.authService.userId;
    if (!userId) return;

    // Load of Characters and Character Raids (chained)
    this.loadCharactersAndCharacterRaids();

    // Load of Raids
    this.loadRaids();
  }

  loadCharactersAndCharacterRaids() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (characters: any) => {
        this.characters = characters;

        // Load of Character Raids
        let characterIds = this.characters.map((c: { id: any; }) => c.id);

        this.characterRaidsService.getCharacterRaidsByCharacterIds(characterIds).subscribe({
          next: raids => {
            this.characterRaids = raids
            console.log(raids)
          },
          error: err => console.error(err)
        })
      },
      error: err => console.error(err)
    });
  }

  loadRaids() {
    this.raidService.getAllRaidsWithGates().subscribe({
      next: (data: any) => {
        console.log(data);
        this.raids = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }
}
