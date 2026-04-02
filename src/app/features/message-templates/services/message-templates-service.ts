import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseResult } from '@core/models/ResponseResult';
import { ConfigService } from '@core/services/config-service';
import { PageRequestDto, PageResponse } from '@shared/models/page.models';
import { Observable } from 'rxjs';
import { MessageTemplate } from '../models/messageTemplate';



@Injectable({
  providedIn: 'root',
})
export class MessageTemplatesService {
  private http = inject(HttpClient);
  private configService = inject(ConfigService);

  private get baseUrl(): string {
    return `${this.configService.apiUrl}/messageTemplate`;
  }

  getMessageTemplateById(id: string): Observable<ResponseResult<MessageTemplate>> {
    return this.http.get<ResponseResult<MessageTemplate>>(`${this.baseUrl}/${id}`);
  }

  addMessageTemplate(payload: MessageTemplate): Observable<ResponseResult> {
    return this.http.post<ResponseResult>(`${this.baseUrl}/add`, payload);
  }

  //put request 
  updateMessageTemplate(id: string, payload: Omit<MessageTemplate, 'smsTmpltName'>): Observable<ResponseResult> {
    return this.http.put<ResponseResult>(`${this.baseUrl}/${id}`, payload);
  }

  deleteMessageTemplate(id: string): Observable<ResponseResult> {
    return this.http.delete<ResponseResult>(`${this.baseUrl}/${id}`);
  }

  //getAllDatatable => [used for:table loading, pagination, filter/search]
  loadMessageTemplates(request: PageRequestDto): Observable<ResponseResult<PageResponse<MessageTemplate>>> {
    return this.http.post<ResponseResult<PageResponse<MessageTemplate>>>(`${this.baseUrl}/getAllDatatable`, request);
  }
}

