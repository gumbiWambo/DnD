import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingThorwsComponent } from './saving-thorws.component';

describe('SavingThorwsComponent', () => {
  let component: SavingThorwsComponent;
  let fixture: ComponentFixture<SavingThorwsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SavingThorwsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SavingThorwsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
