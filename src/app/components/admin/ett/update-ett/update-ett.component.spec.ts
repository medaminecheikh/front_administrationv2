import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEttComponent } from './update-ett.component';

describe('UpdateEttComponent', () => {
  let component: UpdateEttComponent;
  let fixture: ComponentFixture<UpdateEttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateEttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateEttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
