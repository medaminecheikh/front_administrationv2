import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListZoneComponent } from './list-zone.component';

describe('ListZoneComponent', () => {
  let component: ListZoneComponent;
  let fixture: ComponentFixture<ListZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
