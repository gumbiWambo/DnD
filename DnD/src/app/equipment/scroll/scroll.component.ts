import { ThrowStmt } from '@angular/compiler';
import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Language } from 'src/app/interfaces/language';
import { CharacterService } from 'src/app/services/character.service';

@Component({
  selector: 'dnd-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.scss']
})
export class ScrollComponent implements OnInit {
  public opend = false;
  private canRead = false;
  private canUnderstand = false;
  private languages: Language[];
  @Input() message: string;
  @Input() language: Language
  @Input() name: string;
  constructor(private character: CharacterService) {
    this.character.character.pipe(map(x => x.languages)).subscribe((languages: Language[]) => this.languages = languages);
  }
  @HostBinding('class') get languageName() {
    return !this.canRead ? this.language.script.toLocaleLowerCase() : '';
  }

  ngOnInit(): void {
    this.canRead = !!this.languages.find(x => x.script === this.language.script);
    this.canUnderstand = !!this.languages.find(x => x.script === this.language.script && x.name === this.language.name);
    if(!this.canUnderstand) {
      this.message = this.randomize(this.message);
      this.name = this.randomize(this.name);
    }
  }
  private randomize(message: string): string {
    const splittedMessage = message.split('');
    for(var i = splittedMessage.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = splittedMessage[i];
      splittedMessage[i] = splittedMessage[j];
      splittedMessage[j] = tmp;
    }
    return splittedMessage.join('');
  }
}
