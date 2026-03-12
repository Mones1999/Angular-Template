import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, output, ViewChild } from '@angular/core';
import { AuthService } from '@core/services/auth-service';
import { LanguageService } from '@core/services/language-service';
import { ThemeService } from '@core/services/theme-service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { Menu } from 'primeng/menu';
import { Tooltip } from 'primeng/tooltip';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
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

  menuToggle = output<void>();

  @ViewChild('userMenu') userMenu!: Menu;

  userMenuItems: MenuItem[] = [];
  private langSubscription!: Subscription;

  ngOnInit() {
    this.buildUserMenu();
    this.langSubscription = this.translate.onLangChange.subscribe(() => {
      this.buildUserMenu();
    });
  }

  ngOnDestroy() {
    this.langSubscription?.unsubscribe();
  }

  onMenuToggle() {
    this.menuToggle.emit();
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
