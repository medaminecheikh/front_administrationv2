import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectCaisseComponent } from './affect-caisse.component';

describe('AffectCaisseComponent', () => {
  let component: AffectCaisseComponent;
  let fixture: ComponentFixture<AffectCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AffectCaisseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
