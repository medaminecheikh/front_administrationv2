import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailEttComponent } from './detail-ett.component';

describe('DetailEttComponent', () => {
  let component: DetailEttComponent;
  let fixture: ComponentFixture<DetailEttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailEttComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailEttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
