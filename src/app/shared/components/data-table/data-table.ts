import { ChangeDetectionStrategy, Component, computed, input, model, output, signal, ViewChild, viewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import { Button } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { Tooltip } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Card } from 'primeng/card';
import { Paginator, PaginatorState } from 'primeng/paginator';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { ActionConfig, ActionEvent, ActionType, TableColumn } from '@shared/models/data-table.models';

@Component({
    selector: 'app-data-table',
    imports: [
        CommonModule,
        TranslateModule,
        TableModule,
        Button,
        SkeletonModule,
        Tooltip,
        MenuModule,
        IconFieldModule,
        InputIconModule,
        InputTextModule,
        Card,
        Paginator,
    ],
    templateUrl: './data-table.html',
    styleUrl: './data-table.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTable {
    @ViewChild('dt') dt!: Table;
    rowMenu = viewChild<Menu>('rowMenu');
    activeMenuItems = signal<MenuItem[]>([]);

    // Data
    columns = input.required<TableColumn[]>();
    data = input<any[]>([]);
    dataKey = input<string>('id');

    // Lazy loading & pagination
    lazy = input<boolean>(false);
    totalRecords = input<number>(0);
    rows = input<number>(10);
    rowsPerPageOptions = input<number[]>([10, 25, 50]);

    // Loading
    loading = input<boolean>(false);
    skeletonRowCount = input<number>(10);

    // Toolbar
    showAddButton = input<boolean>(true);
    showExportButton = input<boolean>(false);
    addButtonLabel = input<string>('');
    exportButtonLabel = input<string>('');

    // Search
    globalFilterFields = input<string[]>([]);

    // Table display
    stripedRows = input<boolean>(true);
    tableName = input<string>('');
    allRowsCount = input<number>(0);

    // Selection
    selectionMode = input<'multiple' | null>(null);
    selection = model<any[]>([]);

    // Actions
    actionConfig = input<ActionConfig | null>(null);
    frozenActionColumn = input<boolean>(true);

    // Outputs
    onLazyLoad = output<TableLazyLoadEvent>();
    onAddNew = output<void>();
    onExport = output<void>();
    onActionClick = output<ActionEvent>();
    onSelectionChange = output<any[]>();

    // Pagination state
    paginatorFirst = signal(0);
    paginatorRows = signal(0);

    // Computed
    skeletonRows = computed(() =>
        Array.from({ length: this.skeletonRowCount() }, (_, i) => ({ id: i }))
    );

    displayData = computed(() => {
        if (this.lazy()) return this.data();
        const rows = this.paginatorRows() || this.rows();
        return this.data().slice(this.paginatorFirst(), this.paginatorFirst() + rows);
    });

    effectiveTotalRecords = computed(() => {
        return this.lazy() ? this.totalRecords() : this.data().length;
    });



    tableMinWidth = computed(() => {
        let count = this.columns().length;
        if (this.selectionMode()) count++;
        if (this.actionConfig()) count++;
        return `${count * 10}rem`;
    });

    totalColumns = computed(() => {
        let count = this.columns().length;
        if (this.selectionMode()) count++;
        if (this.actionConfig()) count++;
        return count;
    });

    handleLazyLoad(event: TableLazyLoadEvent): void {
        this.onLazyLoad.emit({
            ...event,
            first: this.paginatorFirst(),
            rows: this.paginatorRows() || this.rows(),
        });
    }

    handlePageChange(event: PaginatorState): void {
        this.paginatorFirst.set(event.first ?? 0);
        this.paginatorRows.set(event.rows ?? this.rows());

        if (this.lazy()) {
            this.onLazyLoad.emit({
                first: event.first,
                rows: event.rows,
            } as TableLazyLoadEvent);
        }
    }

    handleSelectionChange(value: any[]): void {
        this.selection.set(value);
        this.onSelectionChange.emit(value);
    }

    handleActionClick(actionType: ActionType, rowData: any): void {
        this.onActionClick.emit({ actionType, rowData });
    }

    canUseExpandedActions(config: ActionConfig): boolean {
        return config.mode === 'EXPANDED' && config.actions.length <= 4;
    }

    toggleRowMenu(event: Event, rowData: any): void {
        this.activeMenuItems.set(this.buildMenuItems(rowData));
        this.rowMenu()?.toggle(event);
    }

    buildMenuItems(rowData: any): MenuItem[] {
        const config = this.actionConfig();
        if (!config) return [];

        return config.actions
            .filter(action => this.isActionVisible(action.visible, rowData))
            .map(action => ({
                label: action.label,
                icon: action.icon,
                disabled: this.isActionDisabled(action.disabled, rowData),
                command: () => this.handleActionClick(action.actionType, rowData),
            }));
    }

    isActionVisible(visible: boolean | ((rowData: any) => boolean) | undefined, rowData: any): boolean {
        if (visible === undefined) return true;
        return typeof visible === 'function' ? visible(rowData) : visible;
    }

    isActionDisabled(disabled: boolean | ((rowData: any) => boolean) | undefined, rowData: any): boolean {
        if (disabled === undefined) return false;
        return typeof disabled === 'function' ? disabled(rowData) : disabled;
    }
}
