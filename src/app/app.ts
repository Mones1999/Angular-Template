import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { LanguageService } from './core/services/language-service';
import { ThemeService } from './core/services/theme-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  providers: [MessageService]
})
export class App {
  protected readonly title = signal('Angular-Template');
  private languageService = inject(LanguageService);
  private themeService = inject(ThemeService);
}