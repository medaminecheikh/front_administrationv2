import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E1EncaissementComponent } from './e1-encaissement.component';

describe('E1EncaissementComponent', () => {
  let component: E1EncaissementComponent;
  let fixture: ComponentFixture<E1EncaissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ E1EncaissementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E1EncaissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
