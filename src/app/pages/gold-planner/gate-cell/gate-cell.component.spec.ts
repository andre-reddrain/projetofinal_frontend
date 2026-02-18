import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GateCellComponent } from './gate-cell.component';

describe('GateCellComponent', () => {
  let component: GateCellComponent;
  let fixture: ComponentFixture<GateCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GateCellComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GateCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
