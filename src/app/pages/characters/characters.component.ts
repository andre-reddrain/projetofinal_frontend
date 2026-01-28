import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { CharacterClassesService } from '../../services/character-classes/character-classes.service';
import { AuthService } from '../../services/auth/auth.service';
import { Toast } from "primeng/toast";
import { NgFor } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from "primeng/tooltip";
import { InputText } from "primeng/inputtext";
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [TextareaModule, InputNumberModule, ButtonModule, FormsModule, Toast, NgFor, Tooltip, InputText],
  templateUrl: './characters.component.html',
  styleUrl: './characters.component.scss',
  providers: [MessageService]
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

      // Load of User's Characters
      this.listCharacters();
    })
  }

  listCharacters() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (data: any) => {
        const charactersData = data.map((character: any) => ({
          ...character,
          characterClass: this.characterClasses.find((cc: { id: any; }) => cc.id === character.characterClassId)
        }))
        this.characters = charactersData;
        console.log(this.characters);
      },
      error: err => {
        console.error(err);
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

  updateCharacter(character: any) {

  }

  deleteCharacter(character: any) {

  }
}
