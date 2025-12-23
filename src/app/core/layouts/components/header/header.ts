import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthService } from '../../../services/auth-service';
import { ThemeService } from '../../../services/theme-service';
import { LanguageService } from '../../../services/language-service';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit, OnDestroy {
  authService = inject(AuthService);
  themeService = inject(ThemeService);
  languageService = inject(LanguageService);
  translate = inject(TranslateService);

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

  private buildMenu() {
    this.menuItems = [
      {
        label: this.translate.instant('HEADER.HOME'),
        icon: 'pi pi-home'
      },
      {
        label: this.translate.instant('HEADER.FEATURES'),
        icon: 'pi pi-star',
        tooltipOptions: {
          tooltipPosition: 'bottom',
          tooltipEvent: 'hover',
          tooltipLabel: this.translate.instant('HEADER.FEATURES_TOOLTIP'),
        }
      },
      {
        label: this.translate.instant('HEADER.LOGOUT'),
        icon: 'pi pi-sign-out',
        command: () => this.authService.logout()
      },
      {
        label: this.translate.instant('HEADER.THEME'),
        icon: 'pi pi-sun',
        command: () => this.themeService.toggleTheme()
      },
      {
        label: this.languageService.currentLang() === 'en' ? 'العربية' : 'English',
        icon: 'pi pi-globe',
        command: () => this.languageService.toggleLang()
      }
    ]
  }
}
