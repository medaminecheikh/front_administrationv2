import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintFactureComponent } from './print-facture.component';

describe('PrintFactureComponent', () => {
  let component: PrintFactureComponent;
  let fixture: ComponentFixture<PrintFactureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrintFactureComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PrintFactureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
