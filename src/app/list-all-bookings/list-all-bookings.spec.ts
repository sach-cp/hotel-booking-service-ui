import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllBookings } from './list-all-bookings';

describe('ListAllBookings', () => {
  let component: ListAllBookings;
  let fixture: ComponentFixture<ListAllBookings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllBookings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllBookings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
