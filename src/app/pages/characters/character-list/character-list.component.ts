import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Tooltip } from 'primeng/tooltip';
import { CharacterService } from '../../../services/character/character.service';
import { ConfirmationService } from 'primeng/api';
import { ConfirmPopup } from 'primeng/confirmpopup';

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
  imports: [TextareaModule, InputNumberModule, ButtonModule, ReactiveFormsModule, Tooltip, InputText, SelectModule, ConfirmPopup],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  providers: [ConfirmationService]
})
export class CharacterListComponent {
  @Input() character!: Character;
  @Input() characterClasses: any;

  @Output() responseMessage = new EventEmitter<any>();
  @Output() deleteCharacter = new EventEmitter<any>();

  private fb: FormBuilder = inject(FormBuilder);

  // Form vars
  form!: FormGroup;

  initialValues!: any;

  constructor(
    private confirmationService: ConfirmationService,
    private characterService: CharacterService) {}

  ngOnInit() {
    this.loadForm();
  }

  //TODO Validações!

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

    let payload = this.form.getRawValue();
    payload = {...payload, classId: this.form.get('characterClass')?.value.id};

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

  confirmDelete(event: Event) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Do you want to delete ' + this.character.name + '?',
      icon: 'pi pi-exclamation-circle',
      rejectButtonProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
      },
      acceptButtonProps: {
        label: 'Delete',
        severity: 'danger'
      },
      accept: () => {
        this.deleteCharacter.emit(this.character.id);
      }
    })
  }
}
