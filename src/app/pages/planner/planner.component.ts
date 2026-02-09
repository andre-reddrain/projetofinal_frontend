import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-planner',
  standalone: true,
  imports: [],
  templateUrl: './planner.component.html',
  styleUrl: './planner.component.scss'
})
export class PlannerComponent {
  characters: any;

  constructor(
    private characterService: CharacterService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.userId;
    if (!userId) return;

    // Load of Characters
    this.characterService.getCharactersOfUser().subscribe({
      next: (data: any) => {
        this.characters = data;
      },
      error: err => {
        console.error(err);
      }
    })
  }
}
