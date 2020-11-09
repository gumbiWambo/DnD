import { Component, OnInit, Input } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Spell } from 'src/app/interfaces/spell';
import { SpellsService } from 'src/app/services/spells.service';

@Component({
  selector: 'dnd-spelllist',
  templateUrl: './spelllist.component.html',
  styleUrls: ['./spelllist.component.scss']
})
export class SpelllistComponent implements OnInit {
  @Input() spells: Spell[] = [];
  public dialogIsOpened = false;
  constructor(private spellProvider: SpellsService) { }

  ngOnInit(): void {
  }
  public submit(form: NgForm) {
    const body = {};
    for(const key in form.controls) {
      if(form.controls.hasOwnProperty(key)) {
        body[key] = form.controls[key].value;
      }
    }
    this.spellProvider.createSpell(body).then(() => {
      for(const key in form.controls) {
        if(form.controls.hasOwnProperty(key)) {
          form.controls[key].setValue(null);
        }
      }
    });
  }

}
