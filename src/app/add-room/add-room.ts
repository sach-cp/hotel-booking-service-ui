import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-add-room',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './add-room.html',
  styleUrl: './add-room.css',
})
export class AddRoom {
  apiGatewayUrl = environment.hotelServiceUrl;
  hotelId: number = 0;
  isSubmitting = false;
  roomForm = new FormGroup({
    hotelId: new FormControl('', Validators.required),
    roomType: new FormControl('', [Validators.required, Validators.minLength(2)]),
    roomNumber: new FormControl('', Validators.required),
    price: new FormControl('', [Validators.required, Validators.min(0)])
  });

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  onSubmit() {
    if (!this.roomForm.valid) {
      console.warn('Form is invalid, not submitting', this.roomForm.value);
      return;
    }

    const roomData = this.roomForm.value;
    console.log('Room data being sent:', roomData);

    // Prevent double submission
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    // Set up headers
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Accept', 'application/json');

    console.log('Request payload:', roomData);

    // server currently returns plain text (not JSON). Request response as text to avoid JSON parse errors
    this.http.post(`${this.apiGatewayUrl}/api/v1/hotels/${roomData.hotelId}/rooms`, roomData, {
      headers, responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);
        this.roomForm.reset();
        // show exact server message or a friendly message
        this.showMessage(typeof responseText === 'string' ? responseText : 'Room added successfully!', 'success');
      },
      error: (err) => {
        console.error('❌ Error sending room data:', err);
        let errorMessage = 'Failed to add room. ';

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
