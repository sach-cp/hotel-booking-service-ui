import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginRequest } from '../login-request';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  apiGatewayUrl = environment.apiGatewayUrl;

  loginForm!: FormGroup;
  token: string = '';

  constructor(private fb: FormBuilder, private http: HttpClient, private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() { localStorage.removeItem('token'); }

  onSubmit() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
    }

    const form = this.loginForm.value;
    const loginData: LoginRequest = {
      username: form.username!,
      password: form.password!
    };

    console.log(loginData);

    this.http.post(`${this.apiGatewayUrl}/api/v1/users/login`, loginData, {
      responseType: 'text'
    }).subscribe({
      next: (responseText: string) => {
        console.log('✅ Server response (text):', responseText);

        // store token for future API calls
        localStorage.setItem('token', responseText);

        this.token = responseText;
        this.loginForm.reset();

        // show exact server message or a friendly message
        this.showMessage('Login successful!', 'success');

        // ✅ Redirect to homepage
        this.router.navigate(['/home-page']);
      },
      error: (err) => {
        console.error('❌ Error sending login data:', err);
        let errorMessage = 'Failed to login. ';

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

  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

}
