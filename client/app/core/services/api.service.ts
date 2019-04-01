import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';




@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(
    private httpClient: HttpClient,
  ) {}


  get(path: string): Observable<any> {

    return this.httpClient.get(encodeURI(`/api${path}`));
  }
  put(path: string, body: Object = {}): Observable<any> {
    return this.httpClient.put(`/api${path}`, body);
  }
  post(path: string, body: Object = {}): Observable<any> {
    return this.httpClient.post(`/api${path}`, body);
  }

  delete(path: string): Observable<any> {
    return this.httpClient.delete(`/api${path}`);
  }


}
