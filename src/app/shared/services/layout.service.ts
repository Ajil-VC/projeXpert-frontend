import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor() { }

  public prSubject = new Subject()
  public pro$ = this.prSubject.asObservable();

}
