import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { Toast } from 'primeng/toast';
import { Tooltip } from 'primeng/tooltip';

interface Character {
  id: string;
  name: string;
  description: string;
  ilvl: number;
  characterClass: any;
  chaosRestCounter: number;
  guardianRestCounter: number;
}

@Component({
  selector: 'app-character-list',
  standalone: true,
  imports: [TextareaModule, InputNumberModule, ButtonModule, ReactiveFormsModule, Toast, Tooltip, InputText, SelectModule],
  templateUrl: './character-list.component.html',
  styleUrl: './character-list.component.scss',
  providers: [MessageService]
})
export class CharacterListComponent {
  @Input() character!: Character;
  @Input() characterClasses: any;

  // Form vars
  form!: FormGroup;

  initialValues!: any;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: [this.character.name],
      description: [this.character.description],
      ilvl: [this.character.ilvl],
      characterClass: [this.character.characterClass],
      chaosRestCounter: [this.character.chaosRestCounter],
      guardianRestCounter: [this.character.guardianRestCounter]
    });

    this.initialValues = this.form.value;

    console.log(this.initialValues);
  }

  isChanged(): boolean {
    return Object.keys(this.form.controls).some(key => this.hasChanged(key));
  }

  hasChanged(controlName: string): boolean {
    return this.form.get(controlName)?.value !== this.initialValues[controlName];
  }

  updateCharacter(character: any) {

  }

  deleteCharacter(character: any) {

  }
}
