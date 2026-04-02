import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ApiResponseEnum } from '@core/enums/ApiResponseEnum';
import { AuthService } from '@core/services/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UtilitiesService } from '@shared/util/utilities-service';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { CardModule } from 'primeng/card';
import { ChangePasswordRequest } from '../../models/ChangePassword';
import { ChangePasswordService } from '../../services/change-password-service';
@Component({
  selector: 'app-change-password',
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    ButtonModule,
    PasswordModule,
    DividerModule,
    CommonModule,
    CardModule
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css',
})
export class ChangePassword implements OnInit {
  private formBuilder = inject(FormBuilder);
  private changePasswordService = inject(ChangePasswordService);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private authService = inject(AuthService);
  utilitiesService = inject(UtilitiesService);

  submitted = false;
  errorCurrentPassword = signal<string>('');
  NewSameAsCurrentPassword = signal<string>('');
  NewPasswordConfirmationMismatch = signal<string>('');

  changePasswordForm = this.formBuilder.nonNullable.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]],
      confirmNewPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  ngOnInit(): void {

  }

  onSubmit(): void {
    this.submitted = true;

    if (this.changePasswordForm.invalid) {
      return;
    }

    const formValue = this.changePasswordForm.getRawValue();
    const payload: ChangePasswordRequest = {
      userid: this.authService.userData()?.userId!,
      userName: this.authService.userData()?.name!,
      currentPassword: formValue.currentPassword,
      newPassword: formValue.newPassword,
      confirmNewPassword: formValue.confirmNewPassword,
    };

    this.changePasswordService.changePassword(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('change_password.toast.success_title'),
          detail: this.translateService.instant('change_password.toast.success_message'),
        });
        this.changePasswordForm.reset();
        this.submitted = false;
        this.authService.logout()
      },
      error: (e) => {
        this.handleServerErrors(e.error);
      }
    });
  }

  handleServerErrors(error: any) {
    switch (error.statusCode) {
      case ApiResponseEnum.ERROR_INCORRECT_CURRENT_PASSWORD:
        this.errorCurrentPassword.set(error.statusDescription);
        break;
      case ApiResponseEnum.ERROR_NEW_PASSWORD_SAME_AS_CURRENT_PASSWORD:
        this.NewSameAsCurrentPassword.set(error.statusDescription);
        break;
      case ApiResponseEnum.ERROR_NEW_PASSWORD_CONFIRMATION_MISMATCH:
        this.NewPasswordConfirmationMismatch.set(error.statusDescription);
        break;
      default:
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('change_password.toast.error_title'),
          detail: this.translateService.instant('change_password.toast.error_message'),
        });
        break;
    }
  }


  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword')?.value;
    const confirmPassword = control.get('confirmNewPassword')?.value;

    if (!newPassword || !confirmPassword) {
      return null;
    }

    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
