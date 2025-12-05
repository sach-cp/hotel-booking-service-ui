import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAllHotels } from './list-all-hotels';

describe('ListAllHotels', () => {
  let component: ListAllHotels;
  let fixture: ComponentFixture<ListAllHotels>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAllHotels]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAllHotels);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
