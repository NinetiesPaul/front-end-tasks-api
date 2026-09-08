import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { TaskService } from '../../services/task.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private readonly auth = inject(AuthService);
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  email = '';
  password = '';

  handleSubmit(): void {
    this.taskService.login(this.email, this.password).subscribe({
      next: (data) => {
        if (data.success) {
          this.auth.login(data.token);
          this.router.navigateByUrl('/');
        } else {
          this.notifications.showError(data.content);
        }
      },
      error: (err) => {
        this.notifications.showError(err?.message);
      },
    });
  }
}
