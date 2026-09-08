import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskService } from '../../../services/task.service';
import { NotificationService } from '../../../services/notification.service';
import { ErrorMessages } from '../../../enums/error-messages';

@Component({
  selector: 'app-create-task',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './create-task.component.html',
  styleUrl: './create-task.component.css',
})
export class CreateTaskComponent {
  private readonly taskService = inject(TaskService);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  title: string | null = null;
  description: string | null = null;
  type: string | null = null;
  buttonDisabled = false;

  readonly typeOptions = [
    { title: 'Feature', value: 'feature' },
    { title: 'Bugfix', value: 'bugfix' },
    { title: 'Hotfix', value: 'hotfix' },
  ];

  onSubmit(): void {
    this.buttonDisabled = true;

    const body: Record<string, unknown> = {};
    if (this.title !== null) body['title'] = this.title;
    if (this.description !== null) body['description'] = this.description;
    if (this.type !== null) body['type'] = this.type;

    this.taskService.createTask(body).subscribe({
      next: (data) => {
        if (data.success) {
          this.router.navigateByUrl(`/task/view/${data.data.id}`);
        } else {
          let message = ErrorMessages['DEFAULT_ERROR_MSG'];
          Object.keys(ErrorMessages).forEach((k) => {
            if (data.content === k) {
              message = ErrorMessages[k];
            }
          });
          this.notifications.showError(message);
        }
        this.buttonDisabled = false;
      },
      error: (err) => {
        this.notifications.showError(err?.message);
        this.buttonDisabled = false;
      },
    });
  }
}
