import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../models/AppConfig';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config?: AppConfig;
  private readonly readySubject = new BehaviorSubject<boolean>(false);

  readonly ready$ = this.readySubject.asObservable();

  setConfig(cfg: AppConfig) {
    this.config = cfg;
    this.readySubject.next(true);
  }

  private ensureConfig(): AppConfig {
    if (!this.config) {
      throw new Error('Application configuration was accessed before it finished loading.');
    }
    return this.config;
  }

  get configSnapshot(): AppConfig {
    return this.ensureConfig();
  }

  get appName(): string {
    return this.ensureConfig().appName;
  }

  get apiUrl(): string {
    return this.ensureConfig().apiUrl;
  }

  get defaultTheme(): 'light' | 'dark' {
    return this.ensureConfig().defaultTheme ?? 'light';
  }

  get featureFlags(): Record<string, boolean> {
    return this.ensureConfig().featureFlags ?? {};
  }

  isFeatureEnabled(flag: string): boolean {
    return !!this.featureFlags[flag];
  }
}
