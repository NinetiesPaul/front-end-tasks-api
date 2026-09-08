import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ErrorMessages } from '../enums/error-messages';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly snackBar = inject(MatSnackBar);

  showError(message?: string): void {
    const text =
      message && message !== '' ? message : ErrorMessages['DEFAULT_ERROR_MSG'];
    this.snackBar.open(text, 'Close', {
      duration: 0,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['error-snackbar'],
    });
  }
}
