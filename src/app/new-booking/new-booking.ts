import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { provideNativeDateAdapter } from '@angular/material/core';
import { RoomResponse } from '../room-response';
import { Router } from '@angular/router';
import { HotelResponse } from '../hotel-response';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-new-booking',
  imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIconModule,
    MatNativeDateModule, ReactiveFormsModule, MatOptionModule, MatSelectModule],
  standalone: true,
  templateUrl: './new-booking.html',
  styleUrl: './new-booking.css',
  encapsulation: ViewEncapsulation.None,
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewBooking {
  // hotel service url
  hotelServiceUrl = environment.hotelServiceUrl;
  bookingForm = new FormGroup({
    destination: new FormControl('', Validators.required),
    checkin: new FormControl('', Validators.required),
    checkout: new FormControl('', Validators.required),
    travellers: new FormControl('', [Validators.required, Validators.min(1)]),
  });

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) { }

  hotels: string[] = [];
  hotelList: HotelResponse[] = [];
  roomList: RoomResponse[] = [];

  ngOnInit() { this.getHotels(); }

  getHotels() {
    const headers = new HttpHeaders().set('Accept', 'application/json');

    this.http.get<HotelResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels`, { headers })
      .subscribe({
        next: (response) => {
          this.hotelList = response;
          this.hotels = response.map(r => r.hotelName);
          console.log('Hotel name list response:', this.hotels);
          this.cdr.markForCheck();

          if (this.hotels.length === 0) {
            this.showMessage('No hotels found.', 'error');
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

  onSearch() {
    const hotelName = this.bookingForm.value.destination;
    const headers = new HttpHeaders().set('Accept', 'application/json');

    const formData = this.bookingForm.value;
    console.log('Searching with data:', formData);

    const formatDate = (d: any) => d ? new Date(d).toISOString().split('T')[0] : '';
    const selectedHotel = this.hotelList.find(hotel => hotel.hotelName.toLowerCase() === hotelName!.toLowerCase());
    if (!selectedHotel) {
      this.showMessage('Select a valid hotel before searching.', 'error');
      return;
    }
    const hotelId = selectedHotel.hotelId;
    const params = new HttpParams()
      .set('hotelName', this.bookingForm.value.destination || '')
      .set('checkInDate', formatDate(this.bookingForm.value.checkin))
      .set('checkOutDate', formatDate(this.bookingForm.value.checkout));

    this.http.get<RoomResponse[]>(`${this.hotelServiceUrl}/api/v1/hotels/${hotelId}/rooms/available`, { headers, params })
      .subscribe({
        next: (response) => {
          this.roomList = response;
          console.log('Room name list response:', this.roomList);
          this.cdr.markForCheck();

          if (this.roomList.length === 0) {
            this.showMessage('No rooms found.', 'error');
          }
        },
        error: (err) => {
          console.error('❌ Error fetching hotel data:', err);
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
        }
      });
  }

  bookNow(room: RoomResponse) {
    this.router.navigate(['/confirm-booking'], {
      queryParams: {
        hotelName: this.bookingForm.value.destination,
        checkInDate: this.bookingForm.value.checkin,
        checkOutDate: this.bookingForm.value.checkout,
        numberOfTravellers: this.bookingForm.value.travellers,
        roomId: room.roomId,
        roomNumber: room.roomNumber,
        roomType: room.roomType,
        price: room.price,
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
