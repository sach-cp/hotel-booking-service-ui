import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FormGroup, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BookingResponse } from '../booking-response';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookingSummaryResponse } from '../booking-summary-response';
import { environment } from '../../environments/environment.development';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-list-all-bookings',
  imports: [MatIconModule, MatDatepickerModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    ReactiveFormsModule, MatNativeDateModule, MatButtonModule],
  standalone: true,
  templateUrl: './list-all-bookings.html',
  styleUrl: './list-all-bookings.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,

})
export class ListAllBookings {
  bookingServiceUrl = environment.hotelServiceUrl;
  bookingListForm = new FormGroup({
    bookingId: new FormControl(''),
    bookingDate: new FormControl(''),
  });

  booking: BookingResponse | null = null;
  bookings: BookingSummaryResponse[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  onSearch() {
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const bookingId = this.bookingListForm.get('bookingId')?.value;
    const bookingDate = this.bookingListForm.get('bookingDate')?.value;

    if (!bookingId && !bookingDate) {
      alert("Please enter Booking ID or Booking Date");
      return;
    }

    const formData = this.bookingListForm.value;
    console.log('Searching with data:', formData);
    const formatDate = (d: any) => d ? new Date(d).toISOString().split('T')[0] : '';

    if (bookingId) {
      this.http.get<BookingResponse>(`${this.bookingServiceUrl}/api/v1/bookings/${bookingId}`, { headers })
        .subscribe({
          next: (response) => {
            this.booking = response;
            this.bookings = [];
            this.cdr.detectChanges();
            console.log('Bookings response:', this.booking);

            if (this.booking === null) {
              this.showMessage('No bookings found.', 'error');
            }
          },
          error: (err) => {
            console.error('❌ Error fetching booking data:', err);
            let errorMessage = 'Failed to retrieve booking data ';

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
    } else {
      const params = new HttpParams().set('bookingDate', formatDate(this.bookingListForm.value.bookingDate));
      this.http.get<BookingSummaryResponse[]>(`${this.bookingServiceUrl}/api/bookings/search-all-bookings`, { headers, params })
        .subscribe({
          next: (response) => {
            this.booking = null;
            this.bookings = response;
            console.log('Bookings response:', this.bookings);

            if (this.bookings === null) {
              this.showMessage('No bookings found.', 'error');
            }
          },
          error: (err) => {
            console.error('❌ Error fetching booking data:', err);
            let errorMessage = 'Failed to retrieve booking data ';

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
