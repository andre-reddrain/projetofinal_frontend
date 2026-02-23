import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GoldPlannerService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getGoldPlanner() {
    const url = this.baseUrl + "/api/gold-planner";

    return this.http.get<[]>(url);
  }
}
