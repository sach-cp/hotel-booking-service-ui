import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveHotel } from './remove-hotel';

describe('RemoveHotel', () => {
  let component: RemoveHotel;
  let fixture: ComponentFixture<RemoveHotel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemoveHotel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RemoveHotel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
