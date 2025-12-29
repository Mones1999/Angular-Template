import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal, RendererFactory2 } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private renderer = inject(RendererFactory2).createRenderer(null, null);
  #isDarkTheme = signal<boolean>(this.getInitialTheme());
  public isDarkTheme = computed(() => this.#isDarkTheme());

  constructor() {
    effect(() => {
      const method = this.#isDarkTheme() ? 'addClass' : 'removeClass';
      this.renderer[method](this.document.documentElement, 'my-app-dark');
      sessionStorage.setItem('app-theme', this.#isDarkTheme() ? 'dark' : 'light');
    });
  }

  public toggleTheme(): void {
    this.#isDarkTheme.update((current) => !current);
  }

  private getInitialTheme(): boolean {
    return sessionStorage.getItem('app-theme') === 'dark';
  }
}