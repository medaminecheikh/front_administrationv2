import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDrComponent } from './list-dr.component';

describe('ListDrComponent', () => {
  let component: ListDrComponent;
  let fixture: ComponentFixture<ListDrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListDrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
