import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailZoneComponent } from './detail-zone.component';

describe('DetailZoneComponent', () => {
  let component: DetailZoneComponent;
  let fixture: ComponentFixture<DetailZoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailZoneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailZoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
