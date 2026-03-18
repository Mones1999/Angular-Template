export interface TableColumn {
    field: string;
    header: string;
    sortable?: boolean;
    type?: 'text' | 'date' | 'currency' | 'number' | 'boolean';
    width?: number;
}

export interface ActionItem {
    actionType: string;
    label: string;
    icon: string;
    severity?: 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast';
    visible?: boolean | ((rowData: any) => boolean);
    disabled?: boolean | ((rowData: any) => boolean);
}

export interface ActionConfig {
    mode: 'EXPANDED' | 'MENU' ;
    actions: ActionItem[];
    menuButtonIcon?: string;
    menuButtonLabel?: string;
}

export interface ActionEvent {
    actionType: string;
    rowData: any;
}
