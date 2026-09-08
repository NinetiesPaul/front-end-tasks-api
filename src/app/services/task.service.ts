import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.serverHost;

  private authHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('token') ?? '';
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  private jsonAuthHeaders(): HttpHeaders {
    return this.authHeaders().set('accept', 'application/json').set('content-type', 'application/json');
  }

  login(username: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { username, password }, {
      headers: new HttpHeaders({
        accept: 'application/json',
        'content-type': 'application/json',
      }),
    });
  }

  listTasks(typeFilter = ''): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/task/list${typeFilter}`, {
      headers: this.authHeaders(),
    });
  }

  createTask(body: Record<string, unknown>): Observable<any> {
    return this.http.post(`${this.baseUrl}/api/task/create`, body, {
      headers: this.jsonAuthHeaders(),
    });
  }

  viewTask(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/task/view/${id}`, {
      headers: this.authHeaders(),
    });
  }

  updateTask(id: string | number, body: Record<string, unknown>): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/task/update/${id}`, body, {
      headers: this.jsonAuthHeaders(),
    });
  }

  closeTask(id: string | number): Observable<any> {
    return this.http.put(`${this.baseUrl}/api/task/close/${id}`, null, {
      headers: this.authHeaders(),
    });
  }

  assignTask(taskId: string | number, userId: string | number): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/api/task/assign/${taskId}`,
      { assigned_to: userId },
      { headers: this.jsonAuthHeaders() },
    );
  }

  unassignTask(assignedId: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/api/task/unassign/${assignedId}`, {
      headers: this.jsonAuthHeaders(),
    });
  }

  listUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/api/users/list`, {
      headers: this.authHeaders(),
    });
  }
}
