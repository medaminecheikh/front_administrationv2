import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaimentAvanceComponent } from './paiment-avance.component';

describe('PaimentAvanceComponent', () => {
  let component: PaimentAvanceComponent;
  let fixture: ComponentFixture<PaimentAvanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaimentAvanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaimentAvanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
