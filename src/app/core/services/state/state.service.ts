// state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Respondent } from '../../models/respondent.model';

@Injectable({
  providedIn: 'root'
})
export class StateService {

  private respondentData = new BehaviorSubject<Respondent | null>(this.getStoredRespondentData());
  private formId = new BehaviorSubject<number | null>(this.getStoredFormId());
  private surveyId = new BehaviorSubject<number | null>(this.getStoredSurveyId()); // Sincronizado con localStorage
  private accessToken = new BehaviorSubject<String | null>(null);

  setAccessToken(token: String): void {
    this.accessToken.next(token);
    localStorage.setItem('accessToken', token.toString());
  }

  getAccessToken(): Observable<String | null> {
    return this.accessToken.asObservable();
  }

  setRespondentData(data: Respondent): void {
    this.respondentData.next(data);
    localStorage.setItem('respondentData', JSON.stringify(data));
  }

  getRespondentData(): Observable<Respondent | null> {
    return this.respondentData.asObservable();
  }

  setFormId(id: number | null): void {
    this.formId.next(id);
    localStorage.setItem('formId', JSON.stringify(id));
  }

  getFormId(): Observable<number | null> {
    return this.formId.asObservable();
  }

  // Recuperar `respondentData` de localStorage
  private getStoredRespondentData(): Respondent | null {
    const storedData = localStorage.getItem('respondentData');
    return storedData ? JSON.parse(storedData) : null;
  }

  // Recuperar `formId` de localStorage
  private getStoredFormId(): number | null {
    const storedId = localStorage.getItem('formId');
    return storedId ? JSON.parse(storedId) : null;
  }

  // Survey ID Management
  setSurveyId(id: number): void {
    this.surveyId.next(id); // Actualiza el BehaviorSubject
    localStorage.setItem('surveyId', id.toString()); // Persiste en localStorage
  }

  getSurveyId(): Observable<number | null> {
    return this.surveyId.asObservable(); // Devuelve el observable del BehaviorSubject
  }

  private getStoredSurveyId(): number | null {
    const storedId = localStorage.getItem('surveyId');
    return storedId ? parseInt(storedId, 10) : null; // Recupera el valor persistido en localStorage
  }

  clearSurveyId(): void {
    this.surveyId.next(null); // Actualiza el BehaviorSubject
    localStorage.removeItem('surveyId'); // Limpia el almacenamiento local
  }

}
