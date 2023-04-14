import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EttComponent } from './ett.component';

describe('EttComponent', () => {
  let component: EttComponent;
  let fixture: ComponentFixture<EttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
