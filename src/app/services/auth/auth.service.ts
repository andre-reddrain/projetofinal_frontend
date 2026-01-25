import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  role: string;
  username: string;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://localhost:8080"

  public currentUser: JwtPayload | null = null;

  constructor(private http: HttpClient) { }

  login(payload: any) {
    const url = this.baseUrl + "/api/login";

    return this.http.post(url, payload);
  }

  setSession(token: string) {
    localStorage.setItem('token', token);

    this.currentUser = jwtDecode<JwtPayload>(token);
    console.log("Decoded user:", this.currentUser);
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      this.currentUser = jwtDecode<JwtPayload>(token);
    }
  }
}
