import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E3VersementComponent } from './e3-versement.component';

describe('E3VersementComponent', () => {
  let component: E3VersementComponent;
  let fixture: ComponentFixture<E3VersementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ E3VersementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E3VersementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
