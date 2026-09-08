import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-main-button',
  standalone: true,
  imports: [RouterLink, MatButtonModule, MatMenuModule],
  templateUrl: './main-button.component.html',
  styleUrl: './main-button.component.css',
})
export class MainButtonComponent {
  readonly auth = inject(AuthService);
}
