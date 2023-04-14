import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailFoncComponent } from './detail-fonc.component';

describe('DetailFoncComponent', () => {
  let component: DetailFoncComponent;
  let fixture: ComponentFixture<DetailFoncComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailFoncComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailFoncComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
