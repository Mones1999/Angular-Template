import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  #isDarkTheme = signal<boolean>(this.getInitialTheme());
  public isDarkTheme = computed(() => this.#isDarkTheme());

  constructor() {
    effect(() => {
      const isDark = this.#isDarkTheme();
      if (isDark) {
        this.document.documentElement.classList.add('my-app-dark');
      } else {
        this.document.documentElement.classList.remove('my-app-dark');
      }
      sessionStorage.setItem('app-theme', isDark ? 'dark' : 'light');
    });
  }

  public toggleTheme(): void {
    this.#isDarkTheme.update((current) => !current);
  }

  private getInitialTheme(): boolean {
    return sessionStorage.getItem('app-theme') === 'dark';
  }
}