import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getCharactersOfUser() {
    const url = this.baseUrl + "/api/characters";

    return this.http.get<[]>(url)
  }

  createCharacter(payload: any) {
    const url = this.baseUrl + "/api/character";

    return this.http.post(url, payload);
  }

  updateCharacter(characterId: string, payload: any) {
    const url = this.baseUrl + "/api/character/" + characterId;

    return this.http.put(url, payload);
  }

  deleteCharacter(characterId: string) {
    const url = this.baseUrl + "/api/character/" + characterId;

    return this.http.delete(url);
  }
}
