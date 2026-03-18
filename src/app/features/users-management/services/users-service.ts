import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfigService } from '@core/services/config-service';
import { ResponseResult } from '@core/models/ResponseResult';
import { PageRequestDto, PageResponse } from '@shared/models/page.models';
import { AddUserForm, User } from '../models/User';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/users`;
  }

  getUsers(request: PageRequestDto): Observable<ResponseResult<PageResponse<User>>> {
    return this.http.post<ResponseResult<PageResponse<User>>>(this.baseUrl, request);
  }

  addUser(payload: AddUserForm): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/add`, payload);
  }

  deleteUser(userId: number): Observable<ResponseResult> {
    return this.http.delete<ResponseResult>(`${this.baseUrl}/${userId}`);
  }

}
