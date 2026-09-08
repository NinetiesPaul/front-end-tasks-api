import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { TaskService } from '../../../services/task.service';
import { NotificationService } from '../../../services/notification.service';
import { StatusList } from '../../../enums/status-list';
import { TypeList } from '../../../enums/type-list';

interface TaskUser {
  id: string | number;
  name: string;
}

interface TaskItem {
  id: string | number;
  title: string;
  type: string;
  status: string;
  created_on: string;
  created_by: TaskUser;
}

@Component({
  selector: 'app-list-tasks',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDividerModule,
  ],
  templateUrl: './list-tasks.component.html',
  styleUrl: './list-tasks.component.css',
})
export class ListTasksComponent implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly notifications = inject(NotificationService);

  readonly StatusList = StatusList;
  readonly TypeList = TypeList;

  tasks: TaskItem[] = [];
  users: TaskUser[] = [];

  filterContext = 'status';
  filterParam = '';
  filterByUser: string | number | null = null;

  readonly filterOptions = [
    { title: 'Status', value: 'status' },
    { title: 'Type', value: 'type' },
    { title: 'Created by', value: 'created_by' },
  ];

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(() => this.loadTasks());
  }

  get filteredTasks(): TaskItem[] {
    return this.tasks.filter((task) => {
      if (this.filterContext !== 'created_by') {
        const value = String((task as any)[this.filterContext] || '').toLowerCase();
        return value.includes(this.filterParam.toLowerCase());
      }
      if (this.filterByUser !== '' && this.filterByUser !== null) {
        return String(task.created_by.id) === String(this.filterByUser);
      }
      return true;
    });
  }

  private loadTasks(): void {
    const tipo = this.route.snapshot.queryParamMap.get('tipo');
    const filterString = tipo ? `?type=${tipo}` : '';

    this.taskService.listTasks(filterString).subscribe({
      next: (data) => {
        this.tasks = data.data.tasks;

        const ids: Array<string | number> = [];
        const filteredUsers: TaskUser[] = [];
        data.data.tasks.forEach((task: TaskItem) => {
          if (!ids.includes(task.created_by.id)) {
            ids.push(task.created_by.id);
            filteredUsers.push({ id: task.created_by.id, name: task.created_by.name });
          }
        });
        this.users = filteredUsers;
      },
      error: (err) => this.notifications.showError(err?.message),
    });
  }
}
