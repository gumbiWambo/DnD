import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpelllistComponent } from './spelllist.component';

describe('SpelllistComponent', () => {
  let component: SpelllistComponent;
  let fixture: ComponentFixture<SpelllistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpelllistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpelllistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
