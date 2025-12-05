import { Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menubar',
  imports: [RouterLink, RouterLinkActive, MatSelectModule, MatIconModule],
  templateUrl: './menubar.html',
  styleUrl: './menubar.css',
})
export class Menubar {
  showMenu = true;
  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      const current = this.router.url;
      this.showMenu =
        !current.includes('/login') &&
        !current.includes('/signup');
    });
  }
  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }

}
