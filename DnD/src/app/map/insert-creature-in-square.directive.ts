import { Directive, HostListener, Input, Renderer2 } from '@angular/core';
import { MapService } from './services/map.service';
import { SquareComponent } from './square/square.component';

@Directive({
  selector: '[dndInsertCreatureInSquare]'
})
export class InsertCreatureInSquareDirective {
  @Input() x: number = 0;
  @Input() y: number = 0;
  private creatureElement: HTMLElement;
  private creatureContainer: HTMLElement;

  constructor(private square: SquareComponent, private map: MapService, private renderer: Renderer2) {
  }
  @HostListener('click') intract() {
    this.map.interact(this.x, this.y);
  }

  ngOnInit() {
    this.map.creaturePositions.subscribe(positions => {
      this.removeCreature();
      const creaturePosition = positions.find(position => position.x === this.x && position.y === this.y);
      if(creaturePosition) {
        this.insertCreature(creaturePosition.color, creaturePosition.characterName);
      }
    });
  }
  insertCreature(color: string, name: string) {
    this.creatureContainer = this.renderer.createElement('div');
    this.renderer.addClass(this.creatureContainer, 'creatureContainer');
    this.creatureElement = this.renderer.createElement('div');
    this.creatureElement.style.backgroundColor = '#' + color;
    this.creatureElement.innerText = name;
    this.renderer.appendChild(this.creatureContainer, this.creatureElement);
    this.renderer.appendChild(this.square.element.nativeElement, this.creatureContainer);

  }
  removeCreature() {
    if(this.creatureElement) {
      this.creatureElement.remove();
    }
    if(this.creatureContainer) {
      this.creatureContainer.remove();
    }
  }



}
