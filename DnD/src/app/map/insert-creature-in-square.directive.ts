import { Directive, Input, Renderer2 } from '@angular/core';
import { MapService } from './services/map.service';
import { SquareComponent } from './square/square.component';

@Directive({
  selector: '[dndInsertCreatureInSquare]'
})
export class InsertCreatureInSquareDirective {
  @Input() x: number = 0;
  @Input() y: number = 0;
  private creatureElement: HTMLElement;

  constructor(private square: SquareComponent, private map: MapService, private renderer: Renderer2) {
    this.map.creaturePositions.subscribe(positions => {
      this.removeCreature();
      const creaturePosition = positions.find(position => position.x === this.x && position.y === this.y);
      if(creaturePosition) {
        this.insertCreature(creaturePosition.color);
      }
    });
    this.map.creaturePositions.next([{x: 1, y: 3, color: 'black'}, {x: 2, y: 8, color: 'green'}])
  }

  ngOnInit() {
  }
  insertCreature(color: string) {
    this.creatureElement = this.renderer.createElement('div')
    this.creatureElement.style.backgroundColor = color;
    this.renderer.appendChild(this.square.element.nativeElement.querySelector('div'), this.creatureElement);
  }
  removeCreature() {
    if(this.creatureElement) {
      this.creatureElement.remove();
    }
  }



}
