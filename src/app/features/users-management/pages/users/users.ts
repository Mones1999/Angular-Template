import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionConfig, ActionEvent, DataTable, TableColumn } from '@shared/components/data-table';
import { PageRequestDto } from '@shared/models/page.models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableLazyLoadEvent } from 'primeng/table';
import { AddUserForm, User } from '../../models/User';
import { UsersService } from '../../services/users-service';
import { ApiResponseEnum } from '@core/enums/ApiResponseEnum';

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    DataTable,
    Dialog,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    ConfirmDialog
  ],
  templateUrl: './users.html',
  styleUrl: './users.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService]
})
export class Users implements OnInit {
  private usersService = inject(UsersService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private confirmationService = inject(ConfirmationService);

  users: User[] = [];
  totalRecords = signal(0);
  loading = signal(true);
  dialogVisible = false;
  submitted = false;
  serverError = signal<string | null>(null);

  addUserForm = this.formBuilder.nonNullable.group(
    {
      username: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: this.passwordMatchValidator }
  );

  columns: TableColumn[] = [
    { field: 'username', header: 'users.columns.username', sortable: true },
    { field: 'fullName', header: 'users.columns.full_name', sortable: true },
  ];

  

  ngOnInit(): void { }

  onLazyLoad(event: TableLazyLoadEvent): void {
    const request: PageRequestDto = {
      first: event.first as number ?? 0,
      rows: event.rows as number ?? 10,
      sortOrder: event.sortOrder ?? 1,
    };

    if (event.sortField) request.sortField = event.sortField as string;
    if (event.globalFilter) request.globalFilter = event.globalFilter as string;

    this.loadUsers(request);
  }

  private loadUsers(request: PageRequestDto): void {
    this.loading.set(true);
    this.usersService.getUsers(request).subscribe({
      next: (res) => {
        this.users = res.result?.data ?? [];
        this.totalRecords.set(res.result?.totalRecords ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onActionClick(event: ActionEvent): void {
    switch (event.actionType) {
      case 'DELETE':
        this.confirmDelete(event.rowData as User);
        break;
      case 'UPDATE':
        console.log('Update user:', event.rowData);
        break;
      default:
        console.log('Action:', event.actionType, 'Row:', event.rowData);
    }
  }

  onAddNew(): void {
    this.addUserForm.reset();
    this.submitted = false;
    this.dialogVisible = true;
  }

  onCancelAddUser(): void {
    this.addUserForm.reset();
    this.submitted = false;
    this.dialogVisible = false;
  }

  onSaveAddUser(): void {
    this.submitted = true;

    if (this.addUserForm.invalid) {
      return;
    }

    const payload: AddUserForm = this.addUserForm.getRawValue();

    this.usersService.addUser(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('users.toast.success_title'),
          detail: this.translateService.instant('users.toast.success_message')
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.addUserForm.reset();
        this.loadUsers({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if(e.error?.statusCode < 0) {
          if(e.error.statusCode === ApiResponseEnum.ERROR_USERNAME_ALREADY_EXISTS) {
             this.addUserForm.controls['username'].setErrors({ usernameExists: true });
             this.serverError.set(e.error?.statusDescription || null);
          }
          return;
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('users.toast.error_title'),
          detail: this.translateService.instant('users.toast.error_message')
        });
      }
    });
  }

  onExport(): void {
    console.log('Export users');
  }

  private confirmDelete(user: User): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('users.confirm_delete.title'),
      message: this.translateService.instant('users.confirm_delete.message', {
        username: user.username,
      }),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteUser(user.userId),
      rejectButtonProps: {
        label: this.translateService.instant('users.confirm_delete.reject'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps:{
        label: this.translateService.instant('users.confirm_delete.accept'),
        severity: 'danger',
        
      }
    });
  }

  private deleteUser(userId: number): void {
    this.usersService.deleteUser(userId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('users.toast.delete_success_title'),
          detail: this.translateService.instant('users.toast.delete_success_message'),
        });
        this.loadUsers({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('users.toast.delete_error_title'),
          detail: this.translateService.instant('users.toast.delete_error_message'),
        });
      },
    });
  }

  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (!password || !confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { passwordMismatch: true };
  }
}
