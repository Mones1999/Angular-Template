import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output, signal } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Divider } from 'primeng/divider';
import { PanelMenu } from 'primeng/panelmenu';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth-service';
import { LanguageService } from '../../../services/language-service';
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    PanelMenu,
    Avatar,
    Button,
    Divider,
    TranslateModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);

  sidebarToggle = output<boolean>();
  isCollapsed = signal(false);

  menuItems: MenuItem[] = [];
  private langSubscription!: Subscription;

  ngOnInit() {
    this.buildMenu();

    // Rebuild menu when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.buildMenu();
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  toggleSidebar() {
    this.isCollapsed.update(v => !v);
    this.sidebarToggle.emit(this.isCollapsed());
  }

  private buildMenu() {
    this.menuItems = [
      {
        label: this.translate.instant('SIDEBAR.MENU.MAIN'),
        icon: 'pi pi-home',
        items: [
          {
            label: this.translate.instant('SIDEBAR.MENU.DASHBOARD'),
            icon: 'pi pi-chart-bar',
            routerLink: '/dashboard'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.ANALYTICS'),
            icon: 'pi pi-chart-line',
            routerLink: '/analytics'
          }
        ]
      },
      {
        label: this.translate.instant('SIDEBAR.MENU.CONTENT'),
        icon: 'pi pi-folder',
        items: [
          {
            label: this.translate.instant('SIDEBAR.MENU.PAGES'),
            icon: 'pi pi-file',
            routerLink: '/pages'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.ABOUT'),
            icon: 'pi pi-info-circle',
            routerLink: '/about-us'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.MEDIA'),
            icon: 'pi pi-images',
            routerLink: '/media'
          }
        ]
      },
      {
        label: this.translate.instant('SIDEBAR.MENU.MANAGEMENT'),
        icon: 'pi pi-users',
        items: [
          {
            label: this.translate.instant('SIDEBAR.MENU.USERS'),
            icon: 'pi pi-user',
            routerLink: '/users'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.ROLES'),
            icon: 'pi pi-shield',
            routerLink: '/roles'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.PERMISSIONS'),
            icon: 'pi pi-lock',
            routerLink: '/permissions'
          }
        ]
      },
      {
        label: this.translate.instant('SIDEBAR.MENU.SETTINGS'),
        icon: 'pi pi-cog',
        items: [
          {
            label: this.translate.instant('SIDEBAR.MENU.GENERAL'),
            icon: 'pi pi-sliders-h',
            routerLink: '/settings/general'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.SECURITY'),
            icon: 'pi pi-key',
            routerLink: '/settings/security'
          },
          {
            label: this.translate.instant('SIDEBAR.MENU.NOTIFICATIONS'),
            icon: 'pi pi-bell',
            routerLink: '/settings/notifications'
          }
        ]
      }
    ];
  }
}
