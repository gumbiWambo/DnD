import { Component, OnInit, Input, AfterContentChecked } from '@angular/core';

@Component({
  selector: 'dnd-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterContentChecked {

  constructor() { }
  @Input() name: string;
  @Input() playerName: string;
  @Input() background: string;
  @Input() dndClass: string;
  @Input() race: string;
  @Input() alignment: string;
  @Input() experience: number;
  public level: number = 0;
  ngOnInit(): void {
  }
  ngAfterContentChecked() {
        if(this.experience < 300) {
          this.level = 1;
        } else if (this.experience < 900) {
          this.level = 2;
        } else if (this.experience < 2700) {
          this.level = 3;
        } else if (this.experience < 6500) {
          this.level = 4;
        } else if (this.experience < 14000) {
          this.level = 5;
        } else if (this.experience < 23000) {
          this.level = 6;
        } else if (this.experience < 34000) {
          this.level = 7;
        } else if (this.experience < 48000) {
          this.level = 8;
        } else if (this.experience < 64000) {
          this.level = 9;
        } else if (this.experience < 85000) {
          this.level = 10;
        }  else if (this.experience < 100000) {
          this.level = 11;
        } else if (this.experience < 120000) {
          this.level = 12;
        } else if (this.experience < 140000) {
          this.level = 13;
        } else if (this.experience < 165000) {
          this.level = 14;
        } else if (this.experience < 195000) {
          this.level = 15;
        } else if (this.experience < 225000) {
          this.level = 16;
        } else if (this.experience < 265000) {
          this.level = 17;
        } else if (this.experience < 305000) {
          this.level = 18;
        } else if (this.experience < 355000) {
          this.level = 19;
        } else {
          this.level = 20;
        }
  }

}
