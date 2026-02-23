import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { CharacterService } from '../../../services/character/character.service';
import { NgIf, NgClass } from '@angular/common';

@Component({
  selector: 'app-character-form',
  standalone: true,
  imports: [DialogModule, TextareaModule, InputNumberModule, ButtonModule, ReactiveFormsModule, InputText, SelectModule, NgIf, NgClass],
  templateUrl: './character-form.component.html',
  styleUrl: './character-form.component.scss'
})
export class CharacterFormComponent {
  @Input() visible: boolean = false;
  @Input() characterClasses: any;
  @Output() visibleChange = new EventEmitter<boolean>();

  @Output() responseMessage = new EventEmitter<any>();

  // Form vars
  form!: FormGroup<{
    name: FormControl<string>;
    description: FormControl<string | null>;
    ilvl: FormControl<number>;
    characterClass: FormControl<any>;
  }>;

  constructor(private fb: FormBuilder, private characterService: CharacterService) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: this.fb.nonNullable.control('', [Validators.required, Validators.minLength(4)]),
      ilvl: this.fb.nonNullable.control(0, [Validators.required, Validators.min(0), 
        Validators.max(1800)]),
      description: this.fb.control<string | null>(null, Validators.maxLength(255)),
      characterClass: this.fb.control(null, Validators.required)
    })
  }

  get f() {
    return this.form.controls;
  }

  isInvalidAndTouched(name: string) {
    const control = this.form.get(name);
    return !!(control && control.invalid && control.touched);
  }

  createCharacter() {
    if (!this.form.valid) return;

    const payload = {
      name: this.form.get('name')?.value,
      description: this.form.get('description')?.value,
      ilvl: this.form.get('ilvl')?.value,
      classId: this.form.get('characterClass')?.value.id
    }

    this.characterService.createCharacter(payload).subscribe({
      next: (data: any) => {
        this.responseMessage.emit({
          type: 'success',
          message: `${payload.name} successfully created!`,
          action: 'update-local',
          payload: data
        });

        this.close();
      },
      error: err => {
        this.responseMessage.emit({
          type: 'error',
          message: 'Error creating character!',
          action: 'toast-only'
        });
        console.error(err);
      }
    });
  }

  /**
   * Fecha a Dialog.
   * É corrido cada vez que a p-dialog se esconde (onHide).
   */
  close() {
    // Devolve para o componente-pai a variável como false
    this.visibleChange.emit(false);
  }
}
