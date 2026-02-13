import { Component } from '@angular/core';

// PrimeNG
import { ProgressSpinner } from 'primeng/progressspinner';

// Services
import { GoldPlannerService } from '../../services/gold-planner/gold-planner.service';
import { CharacterService } from '../../services/character/character.service';

// Services

@Component({
  selector: 'app-gold-planner',
  standalone: true,
  imports: [ProgressSpinner],
  templateUrl: './gold-planner.component.html',
  styleUrl: './gold-planner.component.scss'
})
export class GoldPlannerComponent {
  // Database data
  characters: any = [];
  
  loading = true;

  constructor(
    private characterService: CharacterService,
    private goldPlannerService: GoldPlannerService
  ) {}

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
            console.log(data);
            // Works!
          }
        })
      }
    })
  }

  /* Mental note
  Fazer isto tudo com um endpoint! (Excluindo characters!).
  Necessário recolher Characters - Mesma coisa que raid-planner
  Necessário recolher raids - Mesma coisa que raid-planner, mas:
    - Vai conter uma dropdown (RowExpansion), que vai conter os gates
  Necessário recolher gates - Vão complementar raids
  Necessário recolher gate_details - Contêm difficulty, extraLoot e entry_lvl:
    - Organizá-los por gate_id
      - Organizá-los por difficulty
  Necessário recolher rewards -> Só Gold e Bound Gold!
  Necessário recolher typeRewards -> Só Gold e Bound Gold!

  Isto vai ser o tipo de resposta que o endpoint vai (possivelmente) dar:
  [
    {
      "raidId": "...",
      "raidName": "Brelshaza",
      "raidIcon": "...",
      "gates": [
        {
          "gateId": "...",
          "gateNumber": 1,
          "difficulties": [
            {
              "difficulty": "Normal",
              "entryLevel": 1490,
              "cost": 500,
              "rewards": [
                { "type": "Gold", "amount": 1500 },
                { "type": "Leapstone", "amount": 12 }
              ]
            }
          ]
        }
      ]
    }
  ]

  */
}
