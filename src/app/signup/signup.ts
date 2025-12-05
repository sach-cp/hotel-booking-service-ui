import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SignupRequest } from '../signup-request';
import { environment } from '../../environments/environment.development';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class Signup {
  apiGatewayUrl = environment.apiGatewayUrl;
  isSubmitting = false;
  signupForm!: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      console.log(this.signupForm.value);
    }

    // Prevent double submission
    if (this.isSubmitting) return;
    this.isSubmitting = true;

    const form = this.signupForm.value;

    const userData: SignupRequest = {
      fullName: form.fullName!,
      emailId: form.email!,
      password: form.password!
    };

    console.log(userData);

    this.http.post(`${this.apiGatewayUrl}/api/v1/users/signup`, userData, {
      responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);
        this.signupForm.reset();
        // show exact server message or a friendly message
        this.showMessage(typeof responseText === 'string' ? responseText : 'User added successfully!', 'success');
      },
      error: (err) => {
        console.error('❌ Error sending user data:', err);
        let errorMessage = 'Failed to add user. ';

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
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

}
