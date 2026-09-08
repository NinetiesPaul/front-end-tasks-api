import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TaskService } from '../../../services/task.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusList } from '../../../enums/status-list';
import { TypeList } from '../../../enums/type-list';
import { EnumDictionary } from '../../../enums/enum-dictionary';

@Component({
  selector: 'app-view-task',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatButtonModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
  ],
  templateUrl: './view-task.component.html',
  styleUrl: './view-task.component.css',
})
export class ViewTaskComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  readonly StatusList = StatusList;
  readonly TypeList = TypeList;
  readonly EnumDictionary = EnumDictionary;

  task: any = {};
  createdBy: any = {};
  closedBy: any = null;
  taskHistory: any[] = [];
  assignees: any[] = [];
  users: any[] = [];
  selectedAssignee: string | number | null = null;

  ngOnInit(): void {
    this.loadTask();
  }

  capitalize(field: string): string {
    if (!field) return '';
    return field.charAt(0).toUpperCase() + field.slice(1);
  }

  handleCloseTask(taskId: string | number): void {
    this.taskService.closeTask(taskId).subscribe({
      next: (data) => {
        if (data.success) {
          this.loadTask();
        }
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }

  handleTaskAssignment(userId: string | number | null): void {
    if (userId === null || userId === undefined) return;

    this.taskService.assignTask(this.task.id, userId).subscribe({
      next: () => {
        this.selectedAssignee = null;
        this.loadTask();
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }

  handleTaskUnassignment(assignedId: string | number): void {
    this.taskService.unassignTask(assignedId).subscribe({
      next: () => this.loadTask(),
      error: (err) => this.notifications.showError(err?.message),
    });
  }

  private loadTask(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.taskService.viewTask(id).subscribe({
      next: (data) => {
        this.task = data.data;
        this.createdBy = data.data.created_by;
        this.assignees = data.data.assignees;
        this.taskHistory = data.data.history;
        this.closedBy = data.data.closed_by || null;
        this.loadUsers();
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }

  private loadUsers(): void {
    this.taskService.listUsers().subscribe({
      next: (data) => {
        const currentAssignees = this.assignees.map((a) => a.assigned_to.name);
        this.users = data.data.users.filter(
          (user: any) => !currentAssignees.includes(user.name),
        );
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }
}
