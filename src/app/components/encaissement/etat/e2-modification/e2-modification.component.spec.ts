import { ComponentFixture, TestBed } from '@angular/core/testing';

import { E2ModificationComponent } from './e2-modification.component';

describe('E2ModificationComponent', () => {
  let component: E2ModificationComponent;
  let fixture: ComponentFixture<E2ModificationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ E2ModificationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(E2ModificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
