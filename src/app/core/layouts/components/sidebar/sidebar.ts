import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Ripple } from 'primeng/ripple';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { AuthService } from '@core/services/auth-service';
import { SidebarMenuGroup } from '@core/models/SidebarMenu';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    Avatar,
    Ripple,
    Tooltip,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  authService = inject(AuthService);
  translate = inject(TranslateService);

  sidebarToggle = output<boolean>();
  collapseToggle = output<boolean>();
  collapsed = input(false);
  isOpen = signal(false);

  menuGroups: SidebarMenuGroup[] = [];
  private langSubscription!: Subscription;

  ngOnInit() {
    this.buildMenu();
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.buildMenu();
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  toggleSidebar() {
    this.isOpen.update(v => !v);
    this.sidebarToggle.emit(this.isOpen());
  }

  closeSidebar() {
    this.isOpen.set(false);
    this.sidebarToggle.emit(false);
  }

  toggleCollapse() {
    this.collapseToggle.emit(!this.collapsed());
  }

  private buildMenu() {
    this.menuGroups = [
      {
        label: this.translate.instant('SIDEBAR.GROUPS.GENERAL'),
        items: [
          { label: this.translate.instant('SIDEBAR.MENU.USERS'), icon: 'pi pi-users', route: '/dashboard' },
          { label: this.translate.instant('SIDEBAR.MENU.SYSTEM_SETTINGS'), icon: 'pi pi-cog', route: '/settings/general' },
          { label: this.translate.instant('SIDEBAR.MENU.SMS_TEMPLATES'), icon: 'pi pi-envelope', route: '/sms-templates' },
        ]
      },
      {
        label: this.translate.instant('SIDEBAR.GROUPS.OTHERS'),
        items: [
          { label: this.translate.instant('SIDEBAR.MENU.ABOUT_SYSTEM'), icon: 'pi pi-info-circle', route: '/about-us' },
          { label: this.translate.instant('SIDEBAR.MENU.CHANGE_PASSWORD'), icon: 'pi pi-lock', route: '/change-password' },
        ]
      }
    ];
  }
}
