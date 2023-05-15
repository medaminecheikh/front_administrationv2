import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheEncaissementComponent } from './recherche-encaissement.component';

describe('RechercheEncaissementComponent', () => {
  let component: RechercheEncaissementComponent;
  let fixture: ComponentFixture<RechercheEncaissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheEncaissementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheEncaissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
