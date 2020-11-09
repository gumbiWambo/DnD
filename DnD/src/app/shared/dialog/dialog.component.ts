import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dnd-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  @Input() dialogTitle = '';
  constructor() { }

  ngOnInit(): void {
  }

}
