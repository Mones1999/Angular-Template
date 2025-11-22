import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfigService } from './core/services/config-service';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  providers: [MessageService]
})
export class App {
  private readonly config = inject(ConfigService);
  private readonly themeService = inject(ThemeService);

  protected readonly title = signal(this.config.appName);

  constructor() {
    this.themeService.initialize(this.config.defaultTheme);
  }
}
