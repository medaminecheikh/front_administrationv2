import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListModelComponent } from './list-model.component';

describe('ListModelComponent', () => {
  let component: ListModelComponent;
  let fixture: ComponentFixture<ListModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListModelComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
