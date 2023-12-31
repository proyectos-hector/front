import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthLocalStorage } from '../auth/auth-local-storage';
import { AuthValidator } from '../auth/auth-validator';
import { AuthTokenDecoder } from '../auth/auth-token-decoder';
import { AuthCookieStorage } from '../auth/auth-cookie-storage';
import { environment } from 'src/environments/environment';
import { User } from '@auth0/auth0-angular';
import { Observable, map, catchError, tap, of } from 'rxjs';

const API_URL = environment.API_URL + '/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
  };

  constructor(
    private http: HttpClient,
    private authLocalStorage: AuthLocalStorage,
    private authCookieStorage: AuthCookieStorage,
    private authValidator: AuthValidator,
    private authTokenDecoder: AuthTokenDecoder
  ) {
   }


  isAuthenticated(): boolean {
    return this.authValidator.isTokenValid(
      this.authCookieStorage.getRefreshToken()
    );
  }

  isAuthorized(permissions: string[]): boolean {
    const token = this.authCookieStorage.getRefreshToken();
    return this.authValidator.hasPermission(token, permissions);
  }

  login(email: string, password: string): Observable<any> {
    return this.http
      .post<any>(`${API_URL}/login`, { email, password }, this.httpOptions)
      .pipe(
        map((response) => {
          this.authLocalStorage.setAccessToken(response.data.accessToken);
          this.authCookieStorage.setRefreshToken(response.data.refreshToken);
          return response;
        }),
        catchError(this.handleError<any>('login'))
      );
  }

  logout(): Observable<any> {
    return this.http.delete<any>(`${API_URL}/logout`, this.httpOptions).pipe(
      tap(() => {
        this.authLocalStorage.removeAccessToken();
        this.authCookieStorage.removeRefreshToken();
      })
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${API_URL}/profile`, this.httpOptions);
  }

  updateProfile(user: User): Observable<User> {
    return this.http
      .put<User>(`${API_URL}/profile`, user, this.httpOptions)
      .pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError<any>('updateProfile'))
      );
  }

  getUser(): Observable<any> {
    const token = this.authCookieStorage.getRefreshToken();
    if (!this.authValidator.isTokenValid(token)) {
      return of(null);
    }
    const user = this.authTokenDecoder.decodeToken(token).user;
    return of(user);
  }

  refreshAccessToken(token: string): Observable<any> {
    if (!this.authValidator.isTokenValid(token)) {
      return of(null);
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'refresh-token': token,
      }),
    };
    return this.http.post<any>(`${API_URL}/refresh`, {}, httpOptions);
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    };
  }
}
