import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, ViewEncapsulation  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { HotelResponse } from '../hotel-response';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-list-all-hotels',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './list-all-hotels.html',
  styleUrl: './list-all-hotels.css',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ListAllHotels implements OnInit {
  hotelServiceUrl = environment.hotelServiceUrl;
  hotelList: HotelResponse[] = [];

  constructor(private http: HttpClient, private snackBar: MatSnackBar, private cdr: ChangeDetectorRef) {}

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

          if (this.hotelList.length === 0) {
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

  private showMessage(message: string, type: 'success' | 'error') {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

}
