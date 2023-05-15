import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RechercheFactureComponent } from './recherche-facture.component';

describe('RechercheFactureComponent', () => {
  let component: RechercheFactureComponent;
  let fixture: ComponentFixture<RechercheFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RechercheFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RechercheFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
