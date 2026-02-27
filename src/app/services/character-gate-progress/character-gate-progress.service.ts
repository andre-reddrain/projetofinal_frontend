import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GateProgressState } from '../../pages/gold-planner/gold-planner.component';

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

  bulkUpsertGateProgress(progress: GateProgressState[]) {
    const url = this.baseUrl + "/api/gate-progress/bulk";

    return this.http.put(url, progress);
  }

  setGateProgressCompleted(id: string, value: boolean) {
    const url = `${this.baseUrl}/api/gate-progress/${id}/complete`;
    
    return this.http.patch(url, null, {
      params: { value: value }
    });
  }
}
