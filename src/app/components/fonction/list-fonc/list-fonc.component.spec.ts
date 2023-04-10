import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFoncComponent } from './list-fonc.component';

describe('ListFoncComponent', () => {
  let component: ListFoncComponent;
  let fixture: ComponentFixture<ListFoncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListFoncComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFoncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
