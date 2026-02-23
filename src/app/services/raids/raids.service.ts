import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RaidsService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getAllRaids() {
    const url = this.baseUrl + "/api/raids/all";

    return this.http.get(url);
  }

  getAllRaidsWithGates() {
    const url = this.baseUrl + "/api/raids/gates";

    return this.http.get(url);
  }
}
