import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionConfig, DataTable, TableColumn } from "@shared/components/data-table";
import { ActionEvent } from '@shared/components/data-table';
import { ConfirmationService, MessageService } from 'primeng/api';
import { SystemSetting } from '../../models/systemSetting';
import { PageRequestDto } from '@shared/models/page.models';
import { TableLazyLoadEvent } from 'primeng/table';
import { SystemSettingsService } from '@features/system-settings/services/system-settings-service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ActionType } from '@shared/models/data-table.models';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { ApiResponseEnum } from '@core/enums/ApiResponseEnum';

@Component({
  selector: 'app-system-settings',
  imports: [
    DataTable,
    TranslateModule,
    Dialog,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ReactiveFormsModule,
    CheckboxModule,
    ConfirmDialog,
  ],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css',
  providers: [ConfirmationService]
})
export class SystemSettings {
  private systemSettingsService = inject(SystemSettingsService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);
  private confirmationService = inject(ConfirmationService);

  // Datatable properties
  systemSettings: SystemSetting[] = [];
  totalRecords = signal(0);
  loading = signal(true);
  dialogVisible = false;
  submitted = false;
  serverError = signal<string | null>(null);
  isEditMode = false;
  editingSettingId: number | null = null;

  columns: TableColumn[] = [
    { field: 'name', header: 'system_settings.columns.name', sortable: true },
    { field: 'value', header: 'system_settings.columns.value', sortable: true },
    { field: 'description', header: 'system_settings.columns.description', sortable: true, truncate: true },
    { field: 'friendlyName', header: 'system_settings.columns.friendlyName', sortable: true },
    { field: 'isEditable', header: 'system_settings.columns.isEditable', sortable: true },
  ];

  actionConfig: ActionConfig = {
    mode: 'MENU',
    actions: [
      {
        actionType: ActionType.EDIT,
        label: this.translateService.instant('data_table.update'),
        icon: 'pi pi-pencil',
        severity: 'info',
        disabled: (rowData: any) => rowData.isEditable === '0' || rowData.isEditable === 0 || !rowData.isEditable,
      },
      {
        actionType: ActionType.DELETE,
        label: this.translateService.instant('data_table.delete'),
        icon: 'pi pi-trash',
        severity: 'danger',
      }
    ]
  };

  addSettingForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    value: ['', [Validators.required]],
    friendlyName: ['', [Validators.required]],
    isEditable: [false],
    description: [''],
  });

  onLazyLoad(event: TableLazyLoadEvent): void {
    const request: PageRequestDto = {
      first: event.first as number ?? 0,
      rows: event.rows as number ?? 10,
      sortOrder: event.sortOrder ?? 1,
    };

    if (event.sortField) request.sortField = event.sortField as string;
    if (event.globalFilter) request.globalFilter = event.globalFilter as string;

    this.loadSystemSettings(request);

  }

  loadSystemSettings(request: PageRequestDto): void {
    this.loading.set(true);
    this.systemSettingsService.loadSystemSettings(request).subscribe({
      next: (response) => {
        this.systemSettings = response.result?.data || [];
        this.totalRecords.set(response.result?.totalRecords || 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: this.translateService.instant('system_settings.load_error') });
      }
    });
  }

  onActionClick(event: ActionEvent): void {
    switch (event.actionType) {
      case ActionType.DELETE:
        this.confirmDelete(event.rowData as SystemSetting);
        break;
      case ActionType.EDIT:
        this.onEditSetting(event.rowData as SystemSetting);
        break;
      default:
        console.log('Action:', event.actionType, 'Row:', event.rowData);
    }
  }

  onEditSetting(setting: SystemSetting): void {
    this.isEditMode = true;
    this.editingSettingId = setting.id!;
    this.submitted = false;
    this.addSettingForm.reset();
    this.addSettingForm.controls['isEditable'].disable();
    this.addSettingForm.controls['name'].disable();


    this.systemSettingsService.getSystemSettingById(setting.id!).subscribe({
      next: (res) => {
        const data = res.result;
        if (data) {
          this.addSettingForm.patchValue({
            name: data.name,
            value: data.value,
            description: data.description,
            friendlyName: data.friendlyName,
            isEditable: !!+data.isEditable,
          });
          this.dialogVisible = true;
        }
      },
      error: (e) => {
        if (e.error.statusCode === ApiResponseEnum.SYSTEM_SETTING_GET_BY_ID_FAILED) {
          console.error('Failed to load system setting details', e.error);
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('system_settings.load_error'),
          detail: e.error?.statusDescription || '',
        });
      }
    });
  }

  onAddNew(): void {
    this.isEditMode = false;
    this.editingSettingId = null;
    this.addSettingForm.reset();
    this.submitted = false;
    this.dialogVisible = true;
    this.serverError.set(null);
  }

  onCancelAdd(): void {
    this.addSettingForm.reset();
    this.submitted = false;
    this.isEditMode = false;
    this.editingSettingId = null;
    this.dialogVisible = false;
    this.serverError.set(null);
  }

  onSaveAdd(): void {
    this.submitted = true;

    if (this.addSettingForm.invalid) {
      return;
    }

    if (this.isEditMode) {
      this.saveUpdateSetting();
    } else {
      this.saveNewSetting();
    }
  }

  private saveNewSetting(): void {
    const formValue = this.addSettingForm.getRawValue();
    const payload = { ...formValue, isEditable: formValue.isEditable ? '1' : '0' };

    this.systemSettingsService.addSystemSetting(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('system_settings.toast.success_title'),
          detail: this.translateService.instant('system_settings.toast.success_message'),
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.addSettingForm.reset();
        this.loadSystemSettings({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if (e.error?.statusCode === ApiResponseEnum.ERROR_SYSTEM_SETTING_NAME_ALREADY_EXISTS) {
          this.serverError.set(e.error?.statusDescription || null);
          return;
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('system_settings.toast.error_title'),
          detail: this.translateService.instant('system_settings.toast.error_message'),
        });
      },
    });
  }

  private saveUpdateSetting(): void {
    const formValue = this.addSettingForm.getRawValue();
    const payload = {
      id: this.editingSettingId!,
      ...formValue, isEditable: formValue.isEditable ? '1' : '0',
    };

    this.systemSettingsService.updateSystemSetting(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('system_settings.toast.update_success_title'),
          detail: this.translateService.instant('system_settings.toast.update_success_message'),
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.isEditMode = false;
        this.editingSettingId = null;
        this.addSettingForm.reset();
        this.loadSystemSettings({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if (e.error?.statusCode === ApiResponseEnum.ERROR_SYSTEM_SETTING_NAME_ALREADY_EXISTS) {
          this.serverError.set(e.error?.statusDescription || null);
          return;
        }
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('system_settings.toast.update_error_title'),
          detail: this.translateService.instant('system_settings.toast.update_error_message'),
        });
      },
    });
  }

  private confirmDelete(setting: SystemSetting): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('system_settings.confirm_delete.title'),
      message: this.translateService.instant('system_settings.confirm_delete.message', {
        name: setting.name,
      }),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteSetting(setting),
      rejectButtonProps: {
        label: this.translateService.instant('system_settings.confirm_delete.reject'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translateService.instant('system_settings.confirm_delete.accept'),
        severity: 'danger',
      }
    });
  }

  private deleteSetting(setting: SystemSetting): void {
    this.systemSettingsService.deleteSystemSetting(setting).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('system_settings.toast.delete_success_title'),
          detail: this.translateService.instant('system_settings.toast.delete_success_message'),
        });
        this.loadSystemSettings({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('system_settings.toast.delete_error_title'),
          detail: this.translateService.instant('system_settings.toast.delete_error_message'),
        });
      },
    });
  }
}
