import { Component } from '@angular/core';
import { CharacterClassesService } from '../../../services/character-classes/character-classes.service';
import { NgFor } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [TooltipModule, NgFor],
  templateUrl: './classes.component.html',
  styleUrl: './classes.component.scss'
})
export class ClassesComponent {
  characterClasses: any;

  constructor(private characterClassesService: CharacterClassesService) {}

  ngOnInit() {
    this.characterClassesService.getAllCharacterClasses().subscribe((data: any) => {
      this.characterClasses = data;
      console.log(this.characterClasses)
    })
  }
}
