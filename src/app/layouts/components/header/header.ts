import { Component, inject, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menubar } from 'primeng/menubar';
import { AuthService } from '../../../core/services/auth-service';
import { ThemeService } from '../../../core/services/theme-service';

@Component({
  selector: 'app-header',
  imports: [
    Menubar,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header implements OnInit {
  authService = inject(AuthService);
  themeService = inject(ThemeService);

  menuItems: MenuItem[] = [];

  ngOnInit() {
    this.menuItems = [
      {
        label: 'Home',
        icon: 'pi pi-home'
      },
      {
        label: 'Features',
        icon: 'pi pi-star',
        tooltipOptions: {
          tooltipPosition: 'bottom',
          tooltipEvent: 'hover',
          tooltipLabel: 'New Features Coming Soon!',
        }
      },
      {
        label: 'logout',
        icon: 'pi pi-user',
        command: () => this.authService.logout()
      },
      {
        label: 'theme',
        icon: 'pi pi-sun',
        command: () => this.themeService.toggleTheme()
      }
    ]
  }
}
