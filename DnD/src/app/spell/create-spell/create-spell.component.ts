import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SpellsService } from 'src/app/services/spells.service';

@Component({
  selector: 'dnd-create-spell',
  templateUrl: './create-spell.component.html',
  styleUrls: ['./create-spell.component.scss']
})
export class CreateSpellComponent implements OnInit {

  constructor(private spellProvider: SpellsService) { }

  ngOnInit(): void {
  }
 public insertSpell(form: NgForm) {
   if(form.valid) {
     this.spellProvider.createSpell(form.value).then(x => {
       form.reset();
       this.spellProvider.getSpells();
      });
   }
 }
}
