import { inject, Injectable } from '@angular/core';
import { ChangePasswordService } from '@features/change-password/services/change-password-service';
export interface PasswordValidationResult {
  hasNumber: boolean;
  hasLetter: boolean;
  hasSpecial: boolean;
  hasValidLength: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  // Services Injections
  private changePasswordService = inject(ChangePasswordService);

  // Properties
  passwordMinimumLength: number = 8;
  dynamicMediumRegex: string = '';
  dynamicStrongRegex: string = '';

  constructor() {
    this.getPasswordMinimumLength();
    this.buildRegexPatterns();
  }

  getPasswordMinimumLength() {
    this.changePasswordService.getPasswordMinimumLength().subscribe({
      next: (response) => {
        this.passwordMinimumLength = response.result!;
      },
      error: (e) => {
        console.log('error', e);
      },
    });
  }

  buildRegexPatterns() {
    this.dynamicMediumRegex = `^(?=.*[a-z])(?=.*[0-9]).{${this.passwordMinimumLength},}$`;
    this.dynamicStrongRegex = `^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^a-zA-Z0-9]).{${this.passwordMinimumLength},}$`;
  }
}
