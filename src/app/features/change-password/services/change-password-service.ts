import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseResult } from '@core/models/ResponseResult';
import { ConfigService } from '@core/services/config-service';
import { Observable } from 'rxjs';
import { ChangePasswordRequest } from '../models/ChangePassword';

@Injectable({
  providedIn: 'root',
})
export class ChangePasswordService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/access`;
  }

  changePassword(payload: ChangePasswordRequest): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/change-password`, payload);
  }
  getPasswordMinimumLength(): Observable<ResponseResult> {
    return this.http.get<ResponseResult>(`${this.baseUrl}/get-password-minimum-length`);
  }
}
