import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { SimpleForm } from '../../models/form.model';
import { CreateDecisionDto, CreateSurveyDto, Decision, Survey, UpdateSurveyDto } from '../../models/survey.model';
@Injectable({
  providedIn: 'root'
})
export class SurveyApiService {
  private baseUrl = 'survey';

  constructor(private httpService: HttpService) {}

  // Método para crear una nueva encuesta
  createSurvey(createSurveyDto: CreateSurveyDto): Observable<Survey> {
    return this.httpService.post<Survey>(`${this.baseUrl}`, createSurveyDto);
  }

  // Método para actualizar una encuesta existente
  updateSurvey(id: number, updateSurveyDto: UpdateSurveyDto): Observable<Survey> {
    return this.httpService.put<Survey>(`${this.baseUrl}/${id}`, updateSurveyDto);
  }

  // Método para crear una decisión asociada a una encuesta
  createDecision(createDecisionDto: CreateDecisionDto): Observable<Decision> {
    return this.httpService.post<Decision>(`${this.baseUrl}/decision`, createDecisionDto);
  }

  // Método para hacer un soft delete de una encuesta
  softDeleteSurvey(id: number): Observable<Survey> {
    return this.httpService.patch<Survey>(`${this.baseUrl}/${id}/delete`, {});
  }

}
