import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';
import { CharacterService } from '../../../services/character/character.service';

interface Character {
  id: string;
  name: string;
  description: string;
  ilvl: number;
  characterClass: any;
  characterClassId: string;
  chaosRestCounter: number;
  guardianRestCounter: number;
}

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [TextareaModule, InputNumberModule, ButtonModule, ReactiveFormsModule, Tooltip, InputText, SelectModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  providers: []
})
export class CharacterListComponent {
  @Input() character!: Character;
  @Input() characterClasses: any;

  @Output() responseMessage = new EventEmitter<any>();

  // Form vars
  form!: FormGroup;

  initialValues!: any;

  constructor(private fb: FormBuilder, private characterService: CharacterService) {}

  ngOnInit() {
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      name: [this.character.name],
      description: [this.character.description],
      ilvl: [this.character.ilvl],
      characterClass: [this.character.characterClass],
      chaosRestCounter: [this.character.chaosRestCounter],
      guardianRestCounter: [this.character.guardianRestCounter]
    });

    this.initialValues = this.form.value;
  }

  isChanged(): boolean {
    return Object.keys(this.form.controls).some(key => this.hasChanged(key));
  }

  hasChanged(controlName: string): boolean {
    return this.form.get(controlName)?.value !== this.initialValues[controlName];
  }

  updateCharacter(characterId: string) {
    if (!this.form.dirty) return;

    const payload = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      ilvl: this.form.get('ilvl')?.value,
      chaosRestCounter: this.form.get('chaosRestCounter')?.value,
      guardianRestCounter: this.form.get('guardianRestCounter')?.value,
      classId: this.form.get('characterClass')?.value.id
    }

    this.characterService.updateCharacter(characterId, payload).subscribe({
      next: (data: any) => {
        // Update of the character to match the updated info
        this.character = data;
        this.character.characterClass = this.characterClasses.find((cc: { id: any; }) => cc.id === this.character.characterClassId)

        // Reset form
        this.loadForm();

        this.responseMessage.emit({
          type: 'info',
          message: `${this.character.name} successfully updated!`,
          action: 'toast-only'
        });
      },
      error: err => {
        this.responseMessage.emit({
          type: 'error',
          message: 'Error updating character!',
          action: 'toast-only'
        });
        console.error(err);
      }
    })
  }

  deleteCharacter(character: any) {

  }
}
