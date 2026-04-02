import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseResult } from '@core/models/ResponseResult';
import { ConfigService } from '@core/services/config-service';
import { PageRequestDto, PageResponse } from '@shared/models/page.models';
import { Observable } from 'rxjs';
import { SystemSetting } from '../models/systemSetting';

@Injectable({
  providedIn: 'root',
})
export class SystemSettingsService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/systemSetting`;
  }

  getSystemSettingById(id: number): Observable<ResponseResult<SystemSetting>> {
    return this.http.get<ResponseResult<SystemSetting>>(`${this.baseUrl}/${id}`);
  }

  addSystemSetting(payload: SystemSetting): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/add`, payload);
  }

  updateSystemSetting(payload: SystemSetting): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/edit`, payload);
  }

  deleteSystemSetting(payload: SystemSetting): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/delete`, payload);
  }

  loadSystemSettings(request: PageRequestDto): Observable<ResponseResult<PageResponse<SystemSetting>>> {
    return this.http.post<ResponseResult<PageResponse<SystemSetting>>>(`${this.baseUrl}/getAllDatatable`, request);
  }

}
