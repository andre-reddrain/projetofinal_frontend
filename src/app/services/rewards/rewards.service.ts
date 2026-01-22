import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getRewardsFromGateDetails(gateDetailsIds: string[]) {
    const url = this.baseUrl + "/api/rewards";

    let params = new HttpParams();

    gateDetailsIds.forEach(id => {
      params = params.append('gateDetailsIds', id);
    })

    return this.http.get<[]>(url, { params });
  }

  createRewardsBulk(rewards: any) {
    console.log(rewards)
    const url = this.baseUrl + "/api/rewards/bulk";

    return this.http.post(url, rewards);
  }
}
