import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe } from '@angular/common'
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BookingRequest } from '../booking-request';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-confirm-booking',
  imports: [MatIconModule, DatePipe, ReactiveFormsModule,MatFormFieldModule, MatInputModule],
  templateUrl: './confirm-booking.html',
  styleUrl: './confirm-booking.css',
})
export class ConfirmBooking {
  apiGatewayUrl = environment.hotelServiceUrl;
  isSubmitting = false;

  hotelName: string = '';
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  numberOfTravellers: number = 0;
  roomId: number = 0;
  roomNumber: number = 0;
  roomType: string = '';
  price: number = 0;
  advanceAmount: number = 0;
  paymentMode: string = '';
  paymentStatus: string = '';

  numberOfNights: number = 0;
  totalPrice: number = 0;

  userForm = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    addressDetails: new FormControl('', Validators.required),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    country: new FormControl('', Validators.required),
    pincode: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', Validators.required),
    purposeOfVisit: new FormControl('', Validators.required),
    advanceAmount: new FormControl('', [Validators.required, Validators.min(500)]),
    paymentMode: new FormControl('', Validators.required),
    paymentStatus: new FormControl('', Validators.required)
  });

  constructor(private route: ActivatedRoute, private http: HttpClient, private snackBar: MatSnackBar) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log("Booking data:", params);

      this.hotelName = params['hotelName'];

      // Convert to actual Date objects
      this.checkInDate = params['checkInDate'] ? new Date(params['checkInDate']) : null;
      this.checkOutDate = params['checkOutDate'] ? new Date(params['checkOutDate']) : null;

      this.numberOfTravellers = Number(params['numberOfTravellers']);
      this.roomId = Number(params['roomId']);
      this.roomNumber = Number(params['roomNumber']);
      this.roomType = params['roomType'];
      this.price = Number(params['price']);

      this.calculatePrice();
    });
  }

  calculatePrice() {
    if (!this.checkInDate || !this.checkOutDate) return;

    const diffTime = Math.abs(
      this.checkOutDate.getTime() - this.checkInDate.getTime()
    );

    this.numberOfNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.totalPrice = this.numberOfNights * this.price;
  }

  onSubmit() {
    const bookingData: BookingRequest = {
      roomId: this.roomId,
      numberOfPersons: this.numberOfTravellers,

      customerDto: {
        firstName: this.userForm.value.firstName!,
        lastName: this.userForm.value.lastName!,

        addressDto: {
          addressDetails: this.userForm.value.addressDetails!,
          city: this.userForm.value.city!,
          state: this.userForm.value.state!,
          country: this.userForm.value.country!,
          pinCode: this.userForm.value.pincode!,
        },
        phoneNumber: this.userForm.value.phoneNumber!,
      },

      checkInDate: this.checkInDate?.toISOString().split('T')[0]!,
      checkOutDate: this.checkOutDate?.toISOString().split('T')[0]!,
      
      purposeOfVisit: this.userForm.value.purposeOfVisit!,
      totalAmount: this.totalPrice,
      advanceAmount: Number(this.userForm.value.advanceAmount),
      paymentMode: this.userForm.value.paymentMode!,
      paymentStatus: this.userForm.value.paymentStatus!
    };

    // Prevent double submission
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Set headers
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('Request payload:', bookingData);

    // server currently returns plain text (not JSON). Request response as text to avoid JSON parse errors
    this.http.post(`${this.apiGatewayUrl}/api/v1/bookings/rooms/${this.roomId}`, bookingData, {
      headers, responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);
        this.userForm.reset();
        // show exact server message or a friendly message
        this.showMessage(typeof responseText === 'string' ? responseText : 'Room booked successfully!', 'success');
      },
      error: (err) => {
        console.error('❌ Error sending booking data:', err);
        let errorMessage = 'Failed to book room. ';

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
        this.isSubmitting = false;
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
