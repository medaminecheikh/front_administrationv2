import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEttComponent } from './add-ett.component';

describe('AddEttComponent', () => {
  let component: AddEttComponent;
  let fixture: ComponentFixture<AddEttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
