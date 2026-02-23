import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TypeRewardsService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getAllTypeRewards() {
    const url = this.baseUrl + "/api/type-rewards";

    return this.http.get(url);
  }
}
