import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { NgClass, NgStyle } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialog } from 'primeng/confirmdialog';
import { Dialog } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TableLazyLoadEvent } from 'primeng/table';
import { MessageTemplate } from '@features/message-templates/models/messageTemplate';
import { MessageTemplatesService } from '@features/message-templates/services/message-templates-service';
import { ActionEvent, DataTable, TableColumn } from '@shared/components/data-table';
import { ActionConfig, ActionType } from '@shared/models/data-table.models';
import { PageRequestDto } from '@shared/models/page.models';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ApiResponseEnum } from '@core/enums/ApiResponseEnum';
type SmsLanguage = 'ar' | 'en';

@Component({
  selector: 'app-message-template',
  imports: [
    NgStyle,
    TranslateModule,
    ReactiveFormsModule,
    DataTable,
    Dialog,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    ConfirmDialog,
    FormsModule,
    SelectButtonModule,
  ],
  templateUrl: './message-templates.html',
  styleUrl: './message-templates.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class MessageTemplates {
  // for the validation 
  readonly maxNameLength = 50;
  readonly maxDescriptionLength = 200;
  readonly maxArabicLength = 500;
  readonly maxEnglishLength = 500;




  private readonly templatesService = inject(MessageTemplatesService);
  private readonly formBuilder = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly translateService = inject(TranslateService);
  private readonly confirmationService = inject(ConfirmationService);

  messageTemplates: MessageTemplate[] = [];
  totalRecords = signal(0);
  loading = signal(true);
  dialogVisible = false;
  submitted = false;
  serverError = signal<string | null>(null);
  isEditMode = signal(false);
  editingTemplateName: string | null = null;
  readonly selectedLanguage = signal<SmsLanguage>('ar');


  readonly stateOptions = [
    { label: 'Ar*', value: 'ar' as SmsLanguage },
    { label: 'En', value: 'en' as SmsLanguage },
  ];


  messageTemplateForm = this.formBuilder.nonNullable.group({
    smsTmpltName: ['', [Validators.required, Validators.maxLength(this.maxNameLength)]],
    smsTmpltDesc: ['', [Validators.required, Validators.maxLength(this.maxDescriptionLength)]],
    smsTmpltEng: ['', [Validators.maxLength(this.maxEnglishLength)]],
    smsTmpltArb: ['', [Validators.required, Validators.maxLength(this.maxArabicLength)]],
  });



  //table config 
  columns: TableColumn[] = [
    { field: 'smsTmpltName', header: 'sms_templates.columns.name', sortable: true },
    { field: 'smsTmpltArb', header: 'sms_templates.columns.arabic_text', sortable: true, truncate:true },
    { field: 'smsTmpltEng', header: 'sms_templates.columns.english_text', sortable: true, truncate:true },
    { field: 'smsTmpltDesc', header: 'sms_templates.columns.description', sortable: true, truncate:true },
  ];

  actionConfig: ActionConfig = {
    mode: 'MENU',
    actions: [
      {
        actionType: ActionType.EDIT,
        label: this.translateService.instant('sms_templates.actions.edit'),
        icon: 'pi pi-pencil',
        severity: 'info',
      },
      {
        actionType: ActionType.DELETE,
        label: this.translateService.instant('sms_templates.actions.delete'),
        icon: 'pi pi-trash',
        severity: 'danger',
      },
    ],
  };

  // compute the active textarea once 
  get currentSmsTextControl() {
    return this.selectedLanguage() === 'ar'
      ? this.messageTemplateForm.controls.smsTmpltArb
      : this.messageTemplateForm.controls.smsTmpltEng;
  }

  get currentSmsTextValue(): string {
    return this.currentSmsTextControl.value || '';
  }

  // the counter follows the active language field automatically
  get currentSmsMaxLength(): number {
    return this.selectedLanguage() === 'ar' ? this.maxArabicLength : this.maxEnglishLength;
  }

  get charactersLeft(): number {
    return this.currentSmsMaxLength - this.currentSmsTextValue.length;
  }

  //keep placeholder left, but switch typed Arabic to RTL only after content exists
  get isArabicRtl(): boolean {
    return (this.messageTemplateForm.controls.smsTmpltArb.value || '').trim().length > 0;
  }


  onLazyLoad(event: TableLazyLoadEvent): void {
    const request: PageRequestDto = {
      first: (event.first as number) ?? 0,
      rows: (event.rows as number) ?? 10,
      sortOrder: event.sortOrder ?? 1,
    };

    if (event.sortField) request.sortField = event.sortField as string;
    if (event.globalFilter) request.globalFilter = event.globalFilter as string;

    this.loadMessageTemplates(request);
  }

  private loadMessageTemplates(request: PageRequestDto): void {
    this.loading.set(true);

    this.templatesService.loadMessageTemplates(request).subscribe({
      next: (res) => {
        this.messageTemplates = res.result?.data ?? [];
        this.totalRecords.set(res.result?.totalRecords ?? 0);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('sms_templates.load_error'),
        });
      },
    });
  }


  onActionClick(event: ActionEvent): void {
    switch (event.actionType) {
      case ActionType.DELETE:
        this.confirmDelete(event.rowData as MessageTemplate);
        break;
      case ActionType.EDIT:
        this.onEditTemplate(event.rowData as MessageTemplate);
        break;
    }
  }

  onEditTemplate(template: MessageTemplate): void {
    this.isEditMode.set(true) ;
    this.editingTemplateName = template.smsTmpltName;
    this.submitted = false;
    this.serverError.set(null);
    this.messageTemplateForm.reset();
    this.selectedLanguage.set('ar');

    this.templatesService.getMessageTemplateById(template.smsTmpltName).subscribe({
      next: (res) => {
        const templateData = res.result;
        if (!templateData) return;

        this.messageTemplateForm.patchValue({
          smsTmpltName: templateData.smsTmpltName,
          smsTmpltDesc: templateData.smsTmpltDesc,
          smsTmpltEng: templateData.smsTmpltEng,
          smsTmpltArb: templateData.smsTmpltArb,
        });

        this.dialogVisible = true;
      },
    });
  }

  onAddNew(): void {
    this.isEditMode.set(false);
    this.editingTemplateName = null;
    this.messageTemplateForm.reset();
    this.submitted = false;
    this.serverError.set(null);
    this.selectedLanguage.set('ar');
    this.dialogVisible = true;
  }

  onCancel(): void {
    this.messageTemplateForm.reset();
    this.submitted = false;
    this.isEditMode.set(false);
    this.editingTemplateName = null;
    this.serverError.set(null);
    this.selectedLanguage.set('ar');
    this.dialogVisible = false;
  }


onSave(): void {
  this.submitted = true;
  this.serverError.set(null);

  const nameControl = this.messageTemplateForm.controls.smsTmpltName;
  if (nameControl.hasError('templateExists')) {
    nameControl.setErrors(null);
  }

  if (this.messageTemplateForm.invalid) {
    this.messageTemplateForm.markAllAsTouched();
    return;
  }

  if (this.isEditMode()) {
    this.saveUpdateTemplate();
  } else {
    this.saveNewTemplate();
  }
}

  switchLanguage(lang: SmsLanguage): void {
    this.selectedLanguage.set(lang);
  }
  private saveNewTemplate(): void {
    const formValue = this.messageTemplateForm.getRawValue();

    const payload = {
      ...formValue,
      smsTmpltName: formValue.smsTmpltName.trim(),
      smsTmpltDesc: formValue.smsTmpltDesc.trim(),
    };

    this.templatesService.addMessageTemplate(payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('sms_templates.toast.success_title'),
          detail: this.translateService.instant('sms_templates.toast.add_success_message')
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.messageTemplateForm.reset();
        this.loadMessageTemplates({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if (e.error?.statusCode < 0) {
          if (e.error.statusCode === ApiResponseEnum.ERROR_TEMPLATE_NAME_ALREADY_EXISTS) {
            this.messageTemplateForm.controls['smsTmpltName'].setErrors({ templateExists: true });
            this.serverError.set(e.error?.statusDescription || null);
          }
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('sms_templates.toast.error_title'),
          detail: this.translateService.instant('sms_templates.toast.add_error_message')
        });
      }
    });
  }

  private saveUpdateTemplate(): void {
    const formValue = this.messageTemplateForm.getRawValue();
    const payload = {
      smsTmpltDesc: formValue.smsTmpltDesc,
      smsTmpltEng: formValue.smsTmpltEng,
      smsTmpltArb: formValue.smsTmpltArb,
    };

    this.templatesService.updateMessageTemplate(this.editingTemplateName!, payload).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('sms_templates.toast.success_title'),
          detail: this.translateService.instant('sms_templates.toast.update_success_message'),
        });
        this.dialogVisible = false;
        this.submitted = false;
        this.isEditMode.set(false);
        this.editingTemplateName = null;
        this.messageTemplateForm.reset();
        this.loadMessageTemplates({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: (e) => {
        if (e.error?.statusCode < 0) {
          this.serverError.set(e.error?.statusDescription || null);
          return;
        }

        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('sms_templates.toast.error_title'),
          detail: this.translateService.instant('sms_templates.toast.update_error_message'),
        });
      },
    });
  }

  //delete is protected by confirmation dialog
  private confirmDelete(template: MessageTemplate): void {
    this.confirmationService.confirm({
      header: this.translateService.instant('sms_templates.confirm_delete.title'),
      message: this.translateService.instant('sms_templates.confirm_delete.message', {
        name: template.smsTmpltName,
      }),
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => this.deleteTemplate(template.smsTmpltName),
      rejectButtonProps: {
        label: this.translateService.instant('sms_templates.confirm_delete.reject'),
        severity: 'secondary',
        outlined: true,
      },
      acceptButtonProps: {
        label: this.translateService.instant('sms_templates.confirm_delete.accept'),
        severity: 'danger',
      },
    });
  }

  private deleteTemplate(templateName: string): void {
    this.templatesService.deleteMessageTemplate(templateName).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: this.translateService.instant('sms_templates.toast.delete_success_title'),
          detail: this.translateService.instant('sms_templates.toast.delete_success_message'),
        });
        this.loadMessageTemplates({ first: 0, rows: 10, sortOrder: 1 });
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('sms_templates.toast.delete_error_title'),
          detail: this.translateService.instant('sms_templates.toast.delete_error_message'),
        });
      },
    });
  }


  
}