import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'dnd-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.scss']
})
export class EquipmentComponent implements OnInit, OnDestroy {
  public character;


  private subscriptions: Subscription[] = [];

  constructor(private characterProvider: CharacterService) { 
    this.subscriptions.push(this.characterProvider.character.subscribe(x => this.character = x));
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    while(this.subscriptions.length > 0) {
      this.subscriptions.pop().unsubscribe();
    }
  }

  public useEquipment(equipment: string) {
    this.characterProvider.socket.next({command: 'useEquipment', payload: equipment});
  }
}
