import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service'; // Ajusta la ruta a HttpService
import { Respondent, Career } from '../../models/respondent.model';
@Injectable({
  providedIn: 'root'
})
export class RespondentApiService {
  private baseUrl = 'respondent';

  constructor(private httpService: HttpService) {}

  createOrUpdateRespondent(data: Partial<Respondent>): Observable<Respondent> {
    return this.httpService.post<Respondent>(`${this.baseUrl}`, data);
  }

  updateRespondent(id: number, data: Partial<Respondent>): Observable<Respondent> {
    return this.httpService.put<Respondent>(`${this.baseUrl}/${id}`, data);
  }

  getRespondentByCI(ci: number): Observable<Respondent> {
    return this.httpService.get<Respondent>(`${this.baseUrl}`, {
      params: { ci: ci.toString() }
    });
  }

  saveCareer(careerDto: Career): Observable<Career> {
    return this.httpService.post<Career>(`${this.baseUrl}/career`, careerDto);
  }

  getAllCareers(): Observable<Career[]> {
    return this.httpService.get<Career[]>(`${this.baseUrl}/careers`);
  }
}
