import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GateDetailsService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getGateDetails(gateIds: string[]) {
    const url = this.baseUrl + "/api/gate-details";

    let params = new HttpParams();

    gateIds.forEach(id => {
      params = params.append('gateIds', id);
    })

    return this.http.get<[]>(url, { params })
  }

  getAllGateDetails() {
    const url = this.baseUrl + "/api/gate-details/all";

    return this.http.get(url);
  }
}
