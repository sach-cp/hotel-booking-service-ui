import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';
import { AddHotelRequest } from '../add-hotel-request';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-hotel',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './add-hotel.html',
  styleUrl: './add-hotel.css',
})
export class AddHotel {
  showForm = false;
  apiGatewayUrl = environment.hotelServiceUrl;
  isSubmitting = false;

  hotelName: string = '';

  hotelForm = new FormGroup({
    hotelName: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    addressDetails: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    city: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    state: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    country: new FormControl('', [
      Validators.required,
      Validators.minLength(2)
    ]),

    pinCode: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{6}$/)
    ]),

    phoneNumber: new FormControl('', [
      Validators.required,
      Validators.pattern(/^[0-9]{10}$/)
    ]),

    emailId: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
  });

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  private getToken(): string {
    // SSR-safe check
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('token') || '';
    }
    return '';
  }

  onSubmit() {

    if (!this.hotelForm.valid) {
      console.warn('Form is invalid, not submitting', this.hotelForm.value);
      return;
    }

    const hotelData: AddHotelRequest = {
      hotelName: this.hotelForm.value.hotelName!,

      addressDto: {
        addressDetails: this.hotelForm.value.addressDetails!,
        city: this.hotelForm.value.city!,
        state: this.hotelForm.value.state!,
        country: this.hotelForm.value.country!,
        pinCode: this.hotelForm.value.pinCode!,
      },

      phoneNumber: this.hotelForm.value.phoneNumber!,
      emailId: this.hotelForm.value.emailId!
    };
    console.log('Hotel data being sent:', hotelData);

    // Prevent double submission
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Set up headers
    const token = localStorage.getItem('token');

    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${token}`);
    console.log('Request payload:', hotelData);

    // server currently returns plain text (not JSON). Request response as text to avoid JSON parse errors
    this.http.post(`${this.apiGatewayUrl}/api/v1/hotels`, hotelData, {
      headers, responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);
        this.hotelForm.reset();
        // show exact server message or a friendly message
        this.showMessage(typeof responseText === 'string' ? responseText : 'Hotel added successfully!', 'success');
      },
      error: (err) => {
        console.error('❌ Error sending hotel data:', err);
        let errorMessage = 'Failed to add hotel. ';

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
