import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RaidsService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  raidListWithGates() {
    const url = this.baseUrl + "/api/raids";

    return this.http.get(url);
  }
}
