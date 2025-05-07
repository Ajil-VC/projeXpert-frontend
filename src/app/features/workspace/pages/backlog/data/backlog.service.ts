import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BacklogService{

  constructor(private http: HttpClient) { }

  createEpic(epicName: string, projectId: string): Observable<any> {

    return this.http.post(`${environment.apiUserUrl}create-epic`,{epicName, projectId});
  }


}
