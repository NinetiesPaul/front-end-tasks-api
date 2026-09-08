import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-task-type-quick-filter',
  standalone: true,
  imports: [RouterLink, MatButtonModule],
  templateUrl: './task-type-quick-filter.component.html',
  styleUrl: './task-type-quick-filter.component.css',
})
export class TaskTypeQuickFilterComponent {
  readonly types = ['hotfix', 'feature', 'bugfix'];
}
