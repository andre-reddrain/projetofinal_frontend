import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterGateProgressService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getCharacterGateProgressByCharacterIds(characterIds: string[]) {
    const url = this.baseUrl + "/api/gate-progress";

    let params = new HttpParams();

    characterIds.forEach(id => {
      params = params.append('characterIds', id);
    })

    return this.http.get<[]>(url, { params });
  }
}
