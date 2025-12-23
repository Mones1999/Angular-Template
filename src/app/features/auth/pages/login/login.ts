import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../../core/services/auth-service';
import { AutoFocusModule } from 'primeng/autofocus';
import { MessageModule } from 'primeng/message';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { APP_ROUTES } from '../../../../core/constants/app-routes-constants';
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    InputTextModule,
    PasswordModule,
    ButtonModule,
    CardModule,
    IconFieldModule,
    InputIconModule,
    AutoFocusModule,
    MessageModule,
    TranslateModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);

  public form: FormGroup;
  public submitted = false;

  constructor() {
    this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  public onSubmit(): void {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.form.invalid) {
      return;
    }

    this.authService.login(this.form.value).subscribe({
      next: () => {
        // Login successful, navigate to a protected route
        this.router.navigate([APP_ROUTES.ABOUT_US]);
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('LOGIN.SUCCESS_TITLE'),
          detail: this.translateService.instant('LOGIN.SUCCESS_MESSAGE')
        });
      },
      error: (err) => {
        // Handle login error
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('LOGIN.ERROR_TITLE'),
          detail: this.translateService.instant('LOGIN.ERROR_MESSAGE')
        });
      }
    });
  }

}
