import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';

interface Raid {
  name: string
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
      { name: 'Argos' },
      { name: 'Thaemine' },
      { name: 'Valtan' },
      { name: 'Vykas' },
      { name: 'Brelshaza' },
      { name: 'Aegir' },
      // More sidebar items here...
    ]
  }
}
