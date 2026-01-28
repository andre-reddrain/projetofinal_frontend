import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { CharacterClassesService } from '../../services/character-classes/character-classes.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss'
})
export class CharactersComponent {
  // Create Character Form
  name: string | null = null;
  description: string | null = null;
  ilvl: number | null = null;

  characterClasses: any;
  characters: any;

  selectedCharacterClass: any ;

  constructor(
    private characterService: CharacterService,
    private characterClassesService: CharacterClassesService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const userId = this.authService.userId;
    if (!userId) return;

    // Load of CharacterClasses
    this.characterClassesService.getAllCharacterClasses().subscribe((data: any) => {
      this.characterClasses = data;
      console.log(this.characterClasses)
    })

    // Load of User's Characters
    this.characterService.getCharactersOfUser().subscribe((data: any) => {
      this.characters = data;
      console.log(this.characters);
    })
  }

  listCharacters() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (data: any) => {
        console.log(data)
      },
      error: err => {
        console.error(err)
      }
    })
  }

  submitCharacter() {
    const payload = {
      userId: this.authService.userId,
      classId: this.selectedCharacterClass.id,
      name: this.name,
      description: this.description,
      ilvl: this.ilvl
    }

    this.characterService.createCharacter(payload).subscribe({
      next: (data: any) => {
        // Create successful!
      },
      error: err => {
        // Create error!
      }
    })
  }
}
