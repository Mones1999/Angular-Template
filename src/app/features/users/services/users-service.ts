import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseResult } from '@core/models/ResponseResult';
import { ConfigService } from '@core/services/config-service';
import { PageRequestDto, PageResponse } from '@shared/models/page.models';
import { Observable } from 'rxjs';
import { AddUserForm, UpdateUserForm, User } from '../models/User';

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
    return this.http.post<ResponseResult<PageResponse<User>>>(`${this.baseUrl}/getAllDatatable`, request);
  }

  getUserById(userId: number): Observable<ResponseResult<User>> {
    return this.http.get<ResponseResult<User>>(`${this.baseUrl}/${userId}`);
  }

  addUser(payload: AddUserForm): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/add`, payload);
  }

  updateUser(payload: UpdateUserForm): Observable<ResponseResult> {
    return this.http.put<ResponseResult>(`${this.baseUrl}/update`, payload);
  }

  deleteUser(userId: number): Observable<ResponseResult> {
    return this.http.delete<ResponseResult>(`${this.baseUrl}/${userId}`);
  }

}
