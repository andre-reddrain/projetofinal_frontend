import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';

interface JwtPayload {
  sub: string;
  userId: string;
  role: string;
  username: string;
  iat: number;
  exp: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl: string = "http://localhost:8080"

  public currentUser: JwtPayload | null = null;

  constructor(private http: HttpClient) { }

  get isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  /**
   * Calls the API to login a user.
   * @param payload User inputs (email and password)
   * @returns Backend response
   */
  login(payload: any) {
    const url = this.baseUrl + "/api/auth/login";

    return this.http.post(url, payload);
  }

  createUser(payload: any) {
    const url = this.baseUrl + "/api/auth/register";

    return this.http.post(url, payload);
  }

  /**
   * Creates a session from a JWT token.
   * @param token JWT Token
   */
  setSession(token: string) {
    localStorage.setItem('token', token);

    this.decodeTokenIntoUser(token);
    window.location.reload();
  }

  /**
   * Handles the Logout logic.
   */
  logout() {
    localStorage.removeItem('token');
    this.currentUser = null;
    window.location.reload();
  }

  /**
   * Initial load - Checks if user is already logged in.
   */
  loadUserFromStorage() {
    const token = localStorage.getItem('token');
    if (token) {
      this.decodeTokenIntoUser(token);
    }
  }

  /**
   * Checks if the Token is expired.
   * @param token JWT Token
   * @returns Expired or not (bool)
   */
  isTokenExpired(token: string) {
    try {
      const decoded: any = jwtDecode(token);
      const now = Math.floor(Date.now() / 1000);
      return decoded.exp < now;
    } catch {
      return true;
    }
  }

  /**
   * Decodes the token, and populates the currentUser.
   * @param token JWT Token
   */
  decodeTokenIntoUser(token: string) {
    if (token) {
      this.currentUser = jwtDecode<JwtPayload>(token);
    }
  }

  get userId(): string | null {
    return this.currentUser?.userId ?? null;
  }
}
