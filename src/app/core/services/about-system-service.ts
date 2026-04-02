import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ConfigService } from './config-service';
import { Observable } from 'rxjs';
import { ResponseResult } from '@core/models/ResponseResult';
import { AboutSystem } from '@core/models/AboutSystem';

@Injectable({
  providedIn: 'root',
})
export class AboutSystemService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/aboutSystem`;
  }

  getAboutSystemFields(): Observable<ResponseResult<AboutSystem[]>> {
    return this.http.get<ResponseResult<AboutSystem[]>>(`${this.baseUrl}`);
  }
  
}
