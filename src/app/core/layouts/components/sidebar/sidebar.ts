import { Component, inject, input, OnDestroy, OnInit, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { APP_ROUTES } from '@core/constants/app-routes-constants';
import { SidebarMenuGroup } from '@core/models/SidebarMenu';
import { AuthService } from '@core/services/auth-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Avatar } from 'primeng/avatar';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslateModule,
    Avatar,
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

  userDate = this.authService.userData();

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
        label: this.translate.instant('sidebar.groups.general'),
        items: [
          { label: this.translate.instant('sidebar.menu.users'), icon: 'pi pi-users', route: '/users' },
          { label: this.translate.instant('sidebar.menu.system_settings'), icon: 'pi pi-cog', route: '/settings/general' },
          { label: this.translate.instant('sidebar.menu.sms_templates'), icon: 'pi pi-envelope', route: '/sms-templates' },
        ]
      },
      {
        label: this.translate.instant('sidebar.groups.others'),
        items: [
          { label: this.translate.instant('sidebar.menu.about_system'), icon: 'pi pi-info-circle', route: `/${APP_ROUTES.ABOUT_SYSTEM}` },
          { label: this.translate.instant('sidebar.menu.change_password'), icon: 'pi pi-lock', route: '/change-password' },
        ]
      }
    ];
  }
}
