import { Injectable } from '@angular/core';
import { AppConfig } from '../models/AppConfig';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  private config!: AppConfig;
  
  setConfig(cfg: AppConfig) {
    this.config = cfg;
  }

  get apiUrl() {
    return this.config.apiUrl; 
  }
}
