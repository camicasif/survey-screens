import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: any): Observable<T> {
    // @ts-ignore
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(endpoint: string, data: any, options?: any): Observable<T> {
    // @ts-ignore
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, options).pipe(
      catchError(this.handleError)
    );
  }

  put<T>(endpoint: string, data: any, options?: any): Observable<T> {
    // @ts-ignore
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, options).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(endpoint: string, options?: any): Observable<T> {
    // @ts-ignore
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}`, options).pipe(
      catchError(this.handleError)
    );
  }

  patch<T>(endpoint: string, data: any, options?: any): Observable<T> {
    // @ts-ignore
    return this.http.patch<T>(`${this.baseUrl}/${endpoint}`, data, options).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('HTTP error:', error);
    return throwError(() => new Error('Error en la petición HTTP'));
  }
}
