import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RaidsService {

  constructor(private http: HttpClient) { }

  raidList() {
    const url = "http://localhost:8080/api/raids";

    return this.http.get(url);
  }
}
