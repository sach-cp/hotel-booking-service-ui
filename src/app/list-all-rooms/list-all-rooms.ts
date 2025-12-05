import { Component, ChangeDetectionStrategy, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { RoomResponse } from '../room-response';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { HotelResponse } from '../hotel-response';
@Component({
  selector: 'app-list-all-rooms',
  imports: [CommonModule, FormsModule, MatIconModule, MatFormFieldModule, MatSelectModule, ReactiveFormsModule],
  templateUrl: './list-all-rooms.html',
  styleUrl: './list-all-rooms.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListAllRooms {
  hotelServiceUrl = environment.hotelServiceUrl;
  roomForm = new FormGroup({
    hotelName: new FormControl('', Validators.required)
  });

  roomList: RoomResponse[] = [];  // array of rooms from API
  hotelList: HotelResponse[] = []; // your hotel list
  isSearching = false;

  // To get hotel names for the dropdown
  hotels: string[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.getHotels();
  }

  getHotels() {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http.get<HotelResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels`, { headers })
      .subscribe({
        next: (response) => {
          this.hotelList = response;
          this.cdr.detectChanges();
          this.hotels = response.map(r => r.hotelName);
          console.log('Hotel name list response:', this.hotels);

          if (this.hotels.length === 0) {
            this.showMessage('No hotel names found.', 'error');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching hotel data:', err);
          let errorMessage = 'Failed to retrieve hotel data ';

          if (err.status === 0) {
            errorMessage += 'Cannot reach the server. Please check if the server is running.';
          } else if (err.status === 403) {
            errorMessage += 'Not authorized.';
          } else if (err.error?.message) {
            errorMessage += err.error.message;
          } else {
            errorMessage += 'Please try again.';
          }

          this.showMessage(errorMessage, 'error');
        }
      });
  }

  getRooms(): void {
    const hotelName = this.roomForm.value.hotelName?.trim();
    if (!hotelName) {
      alert('Please enter a hotel name.');
      return;
    }

    const selectedHotel = this.hotelList.find(
      hotel => hotel.hotelName.toLowerCase() === hotelName.toLowerCase()
    );

    if (!selectedHotel) {
      alert('Hotel not found in the list.');
      return;
    }

    const hotelId = selectedHotel.hotelId;

    const params = new HttpParams().set('hotelId', hotelId);
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http.get<RoomResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels/${hotelId}/rooms`, { headers, params })
      .subscribe({
        next: (response) => {
          this.roomList = response;
          this.cdr.detectChanges();
          console.log('Room list response:', this.roomList);

          if (this.roomList.length === 0) {
            this.showMessage('No rooms found for the specified hotel.', 'error');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching room data:', err);
          let errorMessage = 'Failed to retrieve room data ';

          if (err.status === 0) {
            errorMessage += 'Cannot reach the server. Please check if the server is running.';
          } else if (err.status === 403) {
            errorMessage += 'Not authorized.';
          } else if (err.error?.message) {
            errorMessage += err.error.message;
          } else {
            errorMessage += 'Please try again.';
          }

          this.showMessage(errorMessage, 'error');
        },
        complete: () => {
          this.isSearching = false;
        }
      });
  }

  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }
}
