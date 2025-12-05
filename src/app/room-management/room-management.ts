import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterOutlet } from '@angular/router';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-room-management',
  imports: [MatIconModule, MatButtonModule, RouterOutlet, RouterLink],
  templateUrl: './room-management.html',
  styleUrl: './room-management.css',
})
export class RoomManagement {

}
