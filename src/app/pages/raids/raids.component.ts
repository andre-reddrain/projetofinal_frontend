import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

interface Raid {
  name: string,
  type: string
}

@Component({
  selector: 'app-raids',
  standalone: true,
  imports: [ButtonModule, NgFor],
  templateUrl: './raids.component.html',
  styleUrl: './raids.component.scss'
})
export class RaidsComponent {
  raids: Raid[] | undefined;

  ngOnInit() {
    this.raids = [
      { name: 'Argos', type: 'Abyss Raid' },
      { name: 'Thaemine', type: 'Legion Raid' },
      { name: 'Valtan', type: 'Kazeros Raid' },
      { name: 'Vykas', type: 'Abyss Raid' },
      { name: 'Brelshaza', type: 'Abyss Raid' },
      { name: 'Aegir', type: 'Abyss Raid' },
      // More sidebar items here...
    ]
  }
}
