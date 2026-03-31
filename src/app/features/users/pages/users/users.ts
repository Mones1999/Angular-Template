import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ApiResponseEnum } from '@core/enums/ApiResponseEnum';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionEvent, DataTable, TableColumn } from '@shared/components/data-table';
import { PageRequestDto } from '@shared/models/page.models';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableLazyLoadEvent } from 'primeng/table';
import { AddUserForm, UpdateUserForm, User } from '../../models/User';
import { UsersService } from '../../services/users-service';
import { ActionConfig, ActionType } from '@shared/models/data-table.models';
import { AuthService } from '@core/services/auth-service';
import { Divider } from "primeng/divider";
import { UtilitiesService } from '@shared/util/utilities-service';

@Component({
  selector: 'app-users',
  imports: [
    TranslateModule,
    DataTable,
    Dialog,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
    ConfirmDialog,
    Divider
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
  private authService = inject(AuthService);
  
  utilitiesService = inject(UtilitiesService);
  
  users: User[] = [];
  totalRecords = signal(0);
  loading = signal(true);
  dialogVisible = false;
  submitted = false;
  serverError = signal<string | null>(null);
  isEditMode = false;
  editingUserId: number | null = null;

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

  actionConfig: ActionConfig = {
    mode: 'MENU',
    actions: [
      {
      actionType: ActionType.EDIT,
      label: this.translateService.instant('data_table.update'),
      icon: 'pi pi-pencil',
      severity: 'info',
      },
      {
        actionType: ActionType.DELETE,
        label: this.translateService.instant('data_table.delete'),
        icon: 'pi pi-trash',
        severity: 'danger',
      }
    ]
  };



  ngOnInit(): void { 

  }

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
        const currentUserId = this.authService.userData()?.userId;
        this.users = (res.result?.data ?? []).filter(user => user.userId !== currentUserId);
        this.totalRecords.set(res.result?.totalRecords ? res.result.totalRecords - (res.result.data?.some(u => u.userId === currentUserId) ? 1 : 0) : 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  onActionClick(event: ActionEvent): void {
    switch (event.actionType) {
      case ActionType.DELETE:
        this.confirmDelete(event.rowData as User);
        break;
      case ActionType.EDIT:
        this.onEditUser(event.rowData as User);
        break;
      default:
        console.log('Action:', event.actionType, 'Row:', event.rowData);
    }
  }

  onEditUser(user: User): void {
    this.isEditMode = true;
    this.editingUserId = user.userId;
    this.submitted = false;
    this.addUserForm.reset();

    this.usersService.getUserById(user.userId).subscribe({
      next: (res) => {
        const userData = res.result;
        if (userData) {
          this.addUserForm.patchValue({
            username: userData.username,
            fullName: userData.fullName,
          });
          this.updatePasswordValidators();
          this.dialogVisible = true;
        }
      },
    });
  }

  onAddNew(): void {
    this.isEditMode = false;
    this.editingUserId = null;
    this.addUserForm.reset();
    this.updatePasswordValidators();
    this.submitted = false;
    this.dialogVisible = true;
  }

  onCancelAddUser(): void {
    this.addUserForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.editingUserId = null;
    this.dialogVisible = false;
  }

  onSaveAddUser(): void {
    this.submitted = true;

    if (this.addUserForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.saveUpdateUser();
    } else {
      this.saveNewUser();
    }
  }

  private saveNewUser(): void {
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
        if (e.error?.statusCode < 0) {
          if (e.error.statusCode === ApiResponseEnum.ERROR_USERNAME_ALREADY_EXISTS) {
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

  private saveUpdateUser(): void {
    const formValue = this.addUserForm.getRawValue();
    const payload: UpdateUserForm = {
      userId: this.editingUserId!,
      username: formValue.username,
      fullName: formValue.fullName,
    };

    if (formValue.password) {
      payload.password = formValue.password;
      payload.confirmPassword = formValue.confirmPassword;
    }

    this.usersService.updateUser(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('users.toast.update_success_title'),
          detail: this.translateService.instant('users.toast.update_success_message')
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.isEditMode = false;
        this.editingUserId = null;
        this.addUserForm.reset();
        this.loadUsers({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if (e.error?.statusCode < 0) {
          if (e.error.statusCode === ApiResponseEnum.ERROR_USERNAME_ALREADY_EXISTS) {
            this.addUserForm.controls['username'].setErrors({ usernameExists: true });
            this.serverError.set(e.error?.statusDescription || null);
          }
          return;
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('users.toast.update_error_title'),
          detail: this.translateService.instant('users.toast.update_error_message')
        });
      }
    });
  }

  private updatePasswordValidators(): void {
    const passwordControl = this.addUserForm.get('password');
    const confirmPasswordControl = this.addUserForm.get('confirmPassword');

    if (this.isEditMode) {
      passwordControl?.clearValidators();
      passwordControl?.setValidators([Validators.minLength(6)]);
      confirmPasswordControl?.clearValidators();
    } else {
      passwordControl?.setValidators([Validators.required, Validators.minLength(6)]);
      confirmPasswordControl?.setValidators([Validators.required]);
    }

    passwordControl?.updateValueAndValidity();
    confirmPasswordControl?.updateValueAndValidity();
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
      acceptButtonProps: {
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
