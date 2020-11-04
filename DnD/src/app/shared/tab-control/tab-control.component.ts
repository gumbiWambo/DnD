import { Component, OnInit, ContentChildren, Renderer2 } from '@angular/core';
import { TabDirective } from '../tab.directive';

@Component({
  selector: 'dnd-tab-control',
  templateUrl: './tab-control.component.html',
  styleUrls: ['./tab-control.component.scss']
})
export class TabControlComponent implements OnInit {

  @ContentChildren(TabDirective) _tabs;
  public selectedIndex = null;
  get tabs(): TabDirective[] {
    return Array.from(this._tabs)
  }

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }
  ngAfterContentInit() {
    this.showTab(0);    
  }
  public showTab(index: number) {
    this.hideAllTabs();
    this.selectedIndex = index;
    this.renderer.setStyle(this.tabs[index].element.nativeElement, 'display', 'initial');
  }
  private hideAllTabs() {
    this.tabs.forEach((tab: TabDirective) => {
      this.renderer.setStyle(tab.element.nativeElement, 'display', 'none');
    });
  }
}
