import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { MainButtonComponent } from './components/main-button/main-button.component';
import { TaskTypeQuickFilterComponent } from './components/task-type-quick-filter/task-type-quick-filter.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MainButtonComponent, TaskTypeQuickFilterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  readonly auth = inject(AuthService);
}
