import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ActionConfig, DataTable, TableColumn } from "@shared/components/data-table";
import { MessageService } from 'primeng/api';
import { SystemSetting } from '../../models/systemSetting';
import { PageRequestDto } from '@shared/models/page.models';
import { TableLazyLoadEvent } from 'primeng/table';
import { SystemSettingsService } from '@features/system-settings/services/system-settings-service';
import { Dialog } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ActionType } from '@shared/models/data-table.models';

@Component({
  selector: 'app-system-settings',
  imports: [
    DataTable,
    TranslateModule,
    Dialog,
    ButtonModule,
    InputTextModule,
    ReactiveFormsModule,
    CheckboxModule,
  ],
  templateUrl: './system-settings.html',
  styleUrl: './system-settings.css',
})
export class SystemSettings {
  private systemSettingsService = inject(SystemSettingsService);
  private formBuilder = inject(FormBuilder);
  private messageService = inject(MessageService);
  private translateService = inject(TranslateService);

  // Datatable properties
  systemSettings: SystemSetting[] = [];
  totalRecords = signal(0);
  loading = signal(true);
  columns: TableColumn[] = [
    { field: 'name', header: 'system_settings.columns.name', sortable: true },
    { field: 'value', header: 'system_settings.columns.value', sortable: true },
    { field: 'description', header: 'system_settings.columns.description', sortable: true },
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
      },
      {
        actionType: ActionType.DELETE,
        label: this.translateService.instant('data_table.delete'),
        icon: 'pi pi-trash',
        severity: 'danger',
      }
    ]
  };

  dialogVisible = false;
  submitted = false;
  serverError = signal<string | null>(null);

  addSettingForm = this.formBuilder.nonNullable.group({
    name: ['', [Validators.required]],
    value: ['', [Validators.required]],
    description: ['', [Validators.required]],
    friendlyName: ['', [Validators.required]],
    isEditable: [false],
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
    this.systemSettingsService.loadSystemSettings(request).subscribe({
      next: (response) => {
        this.systemSettings = response.result?.data || [];
        this.totalRecords.set(response.result?.totalRecords || 0);
        this.loading.set(false);
      },
      error: (error) => {
        this.loading.set(false);
        this.messageService.add({ severity: 'error', summary: this.translateService.instant('system_settings.load_error') });
      }
    });
  }

  onAddNew(): void {
    this.addSettingForm.reset();
    this.submitted = false;
    this.dialogVisible = true;
  }

  onCancelAdd(): void {
    this.addSettingForm.reset();
    this.submitted = false;
    this.dialogVisible = false;
  }

  onSaveAdd(): void {
    this.submitted = true;

    if (this.addSettingForm.invalid) {
      return;
    }

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
        if (e.error?.statusCode < 0) {
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
}
