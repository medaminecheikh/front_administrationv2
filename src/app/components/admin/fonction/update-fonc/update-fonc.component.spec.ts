import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateFoncComponent } from './update-fonc.component';

describe('UpdateFoncComponent', () => {
  let component: UpdateFoncComponent;
  let fixture: ComponentFixture<UpdateFoncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateFoncComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateFoncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
