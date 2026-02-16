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

@Component({
  selector: 'app-gold-planner',
  standalone: true,
  imports: [ProgressSpinner, FormsModule, TableModule, NgFor, NgIf, ButtonModule],
  templateUrl: './gold-planner.component.html',
  styleUrl: './gold-planner.component.scss'
})
export class GoldPlannerComponent {
  // Database data
  characters: any = [];
  raids: any = [];
  
  loading = false;
  expandedRows = {};

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
            });

            console.log(this.raids);
          }
        })
      }
    })
  }
}
