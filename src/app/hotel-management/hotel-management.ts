import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';


@Component({
  selector: 'app-hotel-management',
  imports: [MatIconModule, MatButtonModule, RouterOutlet, RouterLink],
  templateUrl: './hotel-management.html',
  styleUrl: './hotel-management.css',
})
export class HotelManagement {
}
