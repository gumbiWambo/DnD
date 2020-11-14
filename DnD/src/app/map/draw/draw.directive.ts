import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { Subject, timer } from 'rxjs';
import { filter, map, takeUntil } from 'rxjs/operators';
import { DrawService } from 'src/app/services/draw.service';

@Directive({
  selector: '[dndDraw]'
})
export class DrawDirective {
  @Input() public xAmount = 0;
  @Input() public yAmount = 0;
  private context: OffscreenCanvasRenderingContext2D;
  private isDrawing = false;
  private x: number = 0;
  private y: number = 0;
  private unsubscribe = new Subject<void>();
  constructor(private canvas: ElementRef, private drawSocket: DrawService) {
  }

  ngOnInit() {
    this.canvas.nativeElement.height = this.yAmount * 50;
    this.canvas.nativeElement.width = this.xAmount * 50;
    this.context = this.canvas.nativeElement.getContext('2d');
    this.drawSocket.socket.pipe(map(x => JSON.parse(x.data)), filter(x => x.hasOwnProperty('x1'))).subscribe(draw => {
      this.unsubscribe.next();
      timer(5000).pipe(takeUntil(this.unsubscribe)).subscribe(() => this.clearCanvas());
      this.drawLine(draw.x1, draw.y1, draw.x2, draw.y2, draw.color);
    })
  }

  
  @HostListener('mousedown', ['$event'])
  startDrawing(event: MouseEvent) {
    this.x = event.offsetX;
    this.y = event.offsetY;
    this.isDrawing = true;
    this.unsubscribe.next();
  }
  @HostListener('mouseup', ['$event'])
  endDrawing(event: MouseEvent) {
    if (this.isDrawing === true) {
      this.drawLineByMouseEvent(event.offsetX, event.offsetY);
      this.x = 0;
      this.y = 0;
      this.isDrawing = false;
    }
    timer(5000).pipe(takeUntil(this.unsubscribe)).subscribe(() => this.clearCanvas());
  }
  @HostListener('mousemove', ['$event'])
  draw(event: MouseEvent) {
    if (!!this.isDrawing) {
      this.drawLineByMouseEvent(event.offsetX, event.offsetY);
      this.x = event.offsetX;
      this.y = event.offsetY;
    }
  }
  
  private drawLineByMouseEvent(x, y) {
    this.drawLine(this.x, this.y, x, y, this.drawSocket.color);
    this.drawSocket.draw(this.x, this.y, x, y, this.drawSocket.color);
  }

  private drawLine (x1, y1, x2, y2, color) {
    this.context.beginPath();
    this.context.strokeStyle = color;
    this.context.lineWidth = 2;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
    this.context.closePath();
  }

  private clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height)
  }

}
