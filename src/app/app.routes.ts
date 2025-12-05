import { Routes } from '@angular/router';
import { Homepage } from './homepage/homepage';
import { NewBooking } from './new-booking/new-booking';
import { AddHotel } from './add-hotel/add-hotel';
import { HotelManagement } from './hotel-management/hotel-management';
import { ListAllHotels } from './list-all-hotels/list-all-hotels';
import { ListAllBookings } from './list-all-bookings/list-all-bookings';
import { ConfirmBooking } from './confirm-booking/confirm-booking';
import { RoomManagement } from './room-management/room-management';
import { AddRoom } from './add-room/add-room';
import { ListAllRooms } from './list-all-rooms/list-all-rooms';
import { Login } from './login/login';
import { Signup } from './signup/signup';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
    {
      path: 'login',
      title: 'Login',
      component: Login
    },
    {
      path: 'signup',
      title: 'Sign Up',
      component: Signup
    },
  {
    path: 'home',
    title: 'Home',
    component: Homepage
  },
  {
    path: 'hotel-management',
    component: HotelManagement,
    children: [
      { path: 'add', component: AddHotel },
      { path: 'list', component: ListAllHotels },

      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'room-management',
    component: RoomManagement,
    children: [
      { path: 'add', component: AddRoom},
      { path: 'list', component: ListAllRooms},

      // default view
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  {
    path: 'new-booking',
    title: 'New Booking',
    component: NewBooking
  },
  {
    path: 'bookings-list',
    title: 'Bookings List',
    component: ListAllBookings
  },
  {
    path: 'confirm-booking',
    title: 'Confirm Booking',
    component: ConfirmBooking
  },
  // Catch any undefined routes
  {
    path: '**',
    redirectTo: 'home'
  }
];
