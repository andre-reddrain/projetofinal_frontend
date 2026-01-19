import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaidDialogComponent } from './raid-dialog.component';

describe('RaidDialogComponent', () => {
  let component: RaidDialogComponent;
  let fixture: ComponentFixture<RaidDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RaidDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaidDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
