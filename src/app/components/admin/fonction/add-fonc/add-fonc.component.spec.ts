import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFoncComponent } from './add-fonc.component';

describe('AddFoncComponent', () => {
  let component: AddFoncComponent;
  let fixture: ComponentFixture<AddFoncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFoncComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddFoncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
