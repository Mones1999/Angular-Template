export interface SidebarMenuItem {
    label: string;
    icon: string;
    route: string;
    variant?: 'normal' | 'danger' | 'utility';
}

export interface SidebarMenuGroup {
    label: string;
    items: SidebarMenuItem[];
}
