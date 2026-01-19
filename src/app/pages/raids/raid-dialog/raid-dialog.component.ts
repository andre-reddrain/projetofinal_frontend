import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Dialog } from 'primeng/dialog';

@Component({
  selector: 'app-raid-dialog',
  standalone: true,
  imports: [Dialog],
  templateUrl: './raid-dialog.component.html',
  styleUrl: './raid-dialog.component.scss'
})
export class RaidDialogComponent {

  @Input() visible: boolean = false;
  @Input() raid: any;
  @Output() visibleChange = new EventEmitter<boolean>();

  /**
   * Fecha a Dialog.
   * É corrido cada vez que a p-dialog se esconde (onHide).
   */
  close() {
    // Devolve para o componente-pai a variável como false
    this.visibleChange.emit(false);
  }
}
