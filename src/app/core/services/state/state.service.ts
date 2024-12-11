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
  private surveyId = new BehaviorSubject<number | null>(null); // Nueva propiedad para surveyId
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

  setFormId(id: number|null): void {
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

  setSurveyId(id: number): void {
    this.surveyId.next(id);
  }

  getSurveyId() {
    return this.surveyId.asObservable();
  }

}
