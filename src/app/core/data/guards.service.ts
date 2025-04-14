import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../features/auth/domain/auth.domain';

@Injectable({
  providedIn: 'root'
})
export class GuardsService {

  constructor(private http : HttpClient) { }

  getWorkSpaceData(){

    return this.http.get<AuthResponse>(`${environment.apiUserUrl}init-data`);
  }
}
