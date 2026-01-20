import { NgFor } from '@angular/common';
import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';
import { Dialog } from 'primeng/dialog';
import { GateDetailsService } from '../../../services/gate-details/gate-details.service';

@Component({
  selector: 'app-raid-dialog',
  standalone: true,
  imports: [Dialog, NgFor],
  templateUrl: './raid-dialog.component.html',
  styleUrl: './raid-dialog.component.scss'
})
export class RaidDialogComponent {
  @Input() visible: boolean = false;
  @Input() raid: any;
  @Output() visibleChange = new EventEmitter<boolean>();

  soloGatesData: any;
  normalGatesData: any;
  hardGatesData: any;

  difficulties: any;

  constructor(private gateDetailsService: GateDetailsService) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log("this.raid");
    console.log(this.raid);
    if (changes["visible"] && this.visible) {
      let gateIds = this.raid.gates.map((gate: { id: any; }) =>  gate.id);
      
      this.gateDetailsService.getGateDetails(gateIds).subscribe((data: any) => {
        this.separateGatesByDifficulty(data);
      })
    }
  }

  separateGatesByDifficulty(data: any[]) {
    const raidGates = this.raid.gates;

    // Will be showned in the DOM
    const difficultiesMap: { [key: string]: any[] } = {};

    data.forEach(gate => {
      const difficulty = gate.difficulty;

      // Will set difficulty If not set
      if (!difficultiesMap[difficulty]) {
        difficultiesMap[difficulty] = [];
      }

      difficultiesMap[difficulty].push(gate);
    });

    // Map each gate to include the gate name
    this.difficulties = Object.entries(difficultiesMap).map(([difficulty, gates]) => ({
      difficulty,
      gates: gates.map((gate, index) => ({
        ...gate,
        name: raidGates[index]?.name
      }))
    }));

    console.log("this.difficulties");
    console.log(this.difficulties);
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
