import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateCaisseComponent } from './update-caisse.component';

describe('UpdateCaisseComponent', () => {
  let component: UpdateCaisseComponent;
  let fixture: ComponentFixture<UpdateCaisseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateCaisseComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateCaisseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
