import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../../services/task.service';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [FormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css',
})
export class EditTaskComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly notifications = inject(NotificationService);

  task: any = {};
  createdBy: any = {};

  title: string | null = null;
  description: string | null = null;
  status: string | null = null;
  type: string | null = null;

  readonly statusOptions = [
    { title: 'Open', value: 'open' },
    { title: 'In Dev', value: 'in_dev' },
    { title: 'Blocked', value: 'blocked' },
    { title: 'In QA', value: 'in_qa' },
  ];

  readonly typeOptions = [
    { title: 'Feature', value: 'feature' },
    { title: 'Bugfix', value: 'bugfix' },
    { title: 'Hotfix', value: 'hotfix' },
  ];

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.viewTask(id).subscribe({
      next: (data) => {
        this.task = data.data;
        this.createdBy = data.data.created_by;
        this.title = data.data.title;
        this.description = data.data.description;
        this.status = data.data.status;
        this.type = data.data.type;
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }

  handleUpdate(taskId: string | number): void {
    const body: Record<string, unknown> = {};
    if (this.title !== null) body['title'] = this.title;
    if (this.description !== null) body['description'] = this.description;
    if (this.status !== null) body['status'] = this.status;
    if (this.type !== null) body['type'] = this.type;

    this.taskService.updateTask(taskId, body).subscribe({
      next: () => this.router.navigateByUrl(`/task/view/${taskId}`),
      error: (err) => this.notifications.showError(err?.message),
    });
  }
}
