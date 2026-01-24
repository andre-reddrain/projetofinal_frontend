import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CharacterClassesService {
  private baseUrl: string = "http://localhost:8080";

  constructor(private http: HttpClient) { }

  getAllCharacterClasses() {
    const url = this.baseUrl + "/api/character-classes/all";

    return this.http.get(url);
  }
}
