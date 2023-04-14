import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListEttComponent } from './list-ett.component';

describe('ListEttComponent', () => {
  let component: ListEttComponent;
  let fixture: ComponentFixture<ListEttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListEttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListEttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
