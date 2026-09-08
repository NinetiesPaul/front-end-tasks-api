import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { ListTasksComponent } from './components/tasks/list-tasks/list-tasks.component';
import { CreateTaskComponent } from './components/tasks/create-task/create-task.component';
import { ViewTaskComponent } from './components/tasks/view-task/view-task.component';
import { EditTaskComponent } from './components/tasks/edit-task/edit-task.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'logout', component: LogoutComponent },
  { path: '', component: ListTasksComponent, canActivate: [authGuard] },
  { path: 'task', component: CreateTaskComponent, canActivate: [authGuard] },
  { path: 'task/view/:id', component: ViewTaskComponent, canActivate: [authGuard] },
  { path: 'task/edit/:id', component: EditTaskComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' },
];
