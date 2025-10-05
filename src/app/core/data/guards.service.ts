import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../../features/auth/domain/auth.domain';
import { User } from '../domain/entities/user.model';

@Injectable({
  providedIn: 'root'
})
export class GuardsService {
  private http = inject(HttpClient);


  getWorkSpaceData() {

    return this.http.get<AuthResponse>(`${environment.apiUserUrl}init-data`);
  }


  autherizeAdmin() {
    return this.http.get(`${environment.apiAdminUrl}autherize-admin`);
  }


  authenticateUser() {
    return this.http.get<{ status: boolean, user: User }>(`${environment.apiUserUrl}authenticate-user`);
  }

  //Getting platform-admin related data.
  getInitDataPlatformAdmin() {
    return this.http.get(`${environment.apiAdminUrl}admin-init`);
  }

  adminData() {
    return this.http.get(`${environment.apiAdminUrl}admin`);
  }
}
