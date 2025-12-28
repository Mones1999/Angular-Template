import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Menubar } from 'primeng/menubar';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth-service';
import { LanguageService } from '../../../services/language-service';
import { ThemeService } from '../../../services/theme-service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    Menubar,
    Menu,
    Button,
    Avatar,
    Tooltip,
    TranslateModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);

  @ViewChild('userMenu') userMenu!: Menu;

  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  private langSubscription!: Subscription;

  ngOnInit() {
    this.buildMenu();
    this.buildUserMenu();

    // Rebuild menu when language changes
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.buildMenu();
      this.buildUserMenu();
    });
  }

  ngOnDestroy() {
    if (this.langSubscription) {
      this.langSubscription.unsubscribe();
    }
  }

  private buildMenu() {
    this.menuItems = [
      {
        label: this.translate.instant('HEADER.HOME'),
        icon: 'pi pi-home',
        routerLink: '/dashboard',
        routerLinkActiveOptions: { exact: true }
      },
      {
        label: this.translate.instant('HEADER.ABOUT'),
        icon: 'pi pi-info-circle',
        routerLink: '/about-us'
      },
      {
        label: this.translate.instant('HEADER.FEATURES'),
        icon: 'pi pi-star',
        badge: 'NEW'
      },
      {
        label: this.translate.instant('HEADER.SERVICES'),
        icon: 'pi pi-cog',
        items: [
          {
            label: this.translate.instant('HEADER.SERVICES_CONSULTING'),
            icon: 'pi pi-briefcase'
          },
          {
            label: this.translate.instant('HEADER.SERVICES_DEVELOPMENT'),
            icon: 'pi pi-code'
          },
          {
            label: this.translate.instant('HEADER.SERVICES_SUPPORT'),
            icon: 'pi pi-headphones'
          }
        ]
      }
    ];
  }

  private buildUserMenu() {
    this.userMenuItems = [
      {
        label: this.translate.instant('HEADER.USER_MENU.PROFILE'),
        icon: 'pi pi-user',
        routerLink: '/profile'
      },
      {
        label: this.translate.instant('HEADER.USER_MENU.SETTINGS'),
        icon: 'pi pi-cog',
        routerLink: '/settings'
      },
      {
        separator: true
      },
      {
        label: this.translate.instant('HEADER.LOGOUT'),
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      }
    ];
  }
}
