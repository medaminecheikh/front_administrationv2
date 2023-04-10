import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailDrComponent } from './detail-dr.component';

describe('DetailDrComponent', () => {
  let component: DetailDrComponent;
  let fixture: ComponentFixture<DetailDrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailDrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailDrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
