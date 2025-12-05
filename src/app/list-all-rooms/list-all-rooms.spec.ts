import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllRooms } from './list-all-rooms';

describe('ListAllRooms', () => {
  let component: ListAllRooms;
  let fixture: ComponentFixture<ListAllRooms>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllRooms]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllRooms);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
