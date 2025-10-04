import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private http = inject(HttpClient);


  updateProfile(formData: FormData, isAdmin = false): Observable<any> {
    if (!isAdmin) {
      return this.http.put(`${environment.apiUserUrl}profile`, formData);
    }
    return this.http.put(`${environment.apiAdminUrl}profile`, formData);
  }

}
