import { Component } from '@angular/core';
import { CharacterService } from '../../services/character/character.service';
import { CharacterClassesService } from '../../services/character-classes/character-classes.service';
import { AuthService } from '../../services/auth/auth.service';
import { Toast } from "primeng/toast";
import { NgFor } from '@angular/common';
import { MessageService } from 'primeng/api';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CharacterListComponent } from "./character-list/character-list.component";
import { CharacterFormComponent } from "./character-form/character-form.component";

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [TextareaModule, InputNumberModule, ButtonModule, FormsModule, Toast, CharacterListComponent, NgFor, CharacterFormComponent],
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

  selectedCharacterClass: any;

  visible: boolean = false;

  constructor(
    private characterService: CharacterService,
    private characterClassesService: CharacterClassesService,
    private authService: AuthService,
    private messageService: MessageService
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

  trackByCharacterId(index: number, character: any) {
    return character.id;
  }

  listCharacters() {
    this.characterService.getCharactersOfUser().subscribe({
      next: (data: any) => {
        const charactersData = data.map((character: any) => ({
          ...character,
          characterClass: this.characterClasses.find((cc: { id: any; }) => cc.id === character.characterClassId)
        }))

        this.characters = charactersData;
      },
      error: err => {
        console.error(err);
      }
    })
  }

  deleteCharacter(characterId: string) {
    const character = this.characters.find((c: { id: string; }) => c.id === characterId);

    if (!character) return;

    this.characterService.deleteCharacter(characterId).subscribe({
      next:() => {
        // Update UI
        this.characters = this.characters.filter((c: { id: string; }) => c.id !== characterId);

        const response = {
          type: 'info',
          message: `${character.name} successfully deleted!`,
          action: 'toast-only'
        };

        this.handleResponseMessage(response);
      },
      error: err => {
        const response = {
          type: 'error',
          message: 'Error deleting character!',
          action: 'toast-only'
        };

        this.handleResponseMessage(response);
        console.error(err);
      }
    })
  }

  handleResponseMessage(response: any) {
    if (!response.action) response.action = 'toast-only';

    // Handle action
    switch (response.action) {
      case 'update-local':
        if (response.payload) {
          // Add characterClass from characterClassId
          const char = response.payload;
          char.characterClass = this.characterClasses.find((cc: { id: any; }) => cc.id === char.characterClassId)
          this.characters.push(char);
        }
        break;

      case 'toast-only':
      default:
        break;
    }

    // Handle toast type
    switch (response.type) {
      case 'info':
        this.showInfo(response.message);
        break;

      case 'error':
        this.showError(response.message);
        break;

      case 'success':
        this.showSuccess(response.message);
        break;
      default:
        break;
    }
  }

  /////////////////////
  // Modal Functions //
  /////////////////////

  showCharacterForm() {
    this.visible = !this.visible;
  }

  closeCharacterForm() {
    this.visible = false;
  }

  /////////////////////
  // Toast Functions //
  /////////////////////

  showSuccess(message: string) {
    this.messageService.add({ severity: 'success', summary: 'Success', detail: message });
  }

  showError(message: string) {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  showInfo(message: string) {
    this.messageService.add({ severity: 'info', summary: 'Info', detail: message })
  }
}
