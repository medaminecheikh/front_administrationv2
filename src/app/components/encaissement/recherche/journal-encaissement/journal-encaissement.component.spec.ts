import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalEncaissementComponent } from './journal-encaissement.component';

describe('JournalEncaissementComponent', () => {
  let component: JournalEncaissementComponent;
  let fixture: ComponentFixture<JournalEncaissementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JournalEncaissementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalEncaissementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
