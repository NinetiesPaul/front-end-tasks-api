import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: '',
})
export class LogoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
