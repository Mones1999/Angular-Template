import { Component, inject, OnInit, OnDestroy, ViewChild, signal, HostListener, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { Menu } from 'primeng/menu';
import { Button } from 'primeng/button';
import { Avatar } from 'primeng/avatar';
import { Badge } from 'primeng/badge';
import { Tooltip } from 'primeng/tooltip';
import { Ripple } from 'primeng/ripple';
import { AuthService } from '../../../services/auth-service';
import { ThemeService } from '../../../services/theme-service';
import { LanguageService } from '../../../services/language-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    Menubar,
    Menu,
    Button,
    Avatar,
    Badge,
    Tooltip,
    Ripple,
    TranslateModule,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);

  @ViewChild('userMenu') userMenu!: Menu;

  menuItems: MenuItem[] = [];
  userMenuItems: MenuItem[] = [];
  menuToggle = output<void>();
  private langSubscription!: Subscription;

  toggleMenu() {
    this.menuToggle.emit();
  }

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

  @HostListener('window:scroll')
  onWindowScroll() {
    // Close the user menu when scrolling to prevent position jumping
    if (this.userMenu) {
      this.userMenu.hide();
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
