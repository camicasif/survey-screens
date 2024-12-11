import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { SimpleForm, FormComplete, Form, AuthData, ResponseAuth } from '../../models/form.model';
@Injectable({
  providedIn: 'root'
})
export class FormApiService {
  private baseUrl = 'form';

  constructor(private httpService: HttpService) {}


  getAllFormsOpen(): Observable<SimpleForm[]> {
    return this.httpService.get<SimpleForm[]>(`${this.baseUrl}/open`);
  }
  getAllForms(): Observable<Form[]> {
    return this.httpService.get<Form[]>(`${this.baseUrl}`);
  }

  getFormWithQuestionsAndAnswers(id:number): Observable<FormComplete> {
    return this.httpService.get<FormComplete>(`${this.baseUrl}/${id}`);
  }

  updateFormStatus(formId: number, isOpen: boolean): Observable<void> {
    return this.httpService.patch<void>(`${this.baseUrl}/${formId}/toggle`, { isOpen });
  }


  // Crear o actualizar un formulario (nuevo si no tiene ID)
  createOrUpdateForm(form: FormComplete): Observable<FormComplete> {
      return this.httpService.post<FormComplete>(`${this.baseUrl}`, form);
  }

  login(data: AuthData): Observable<ResponseAuth> {
    return this.httpService.post<ResponseAuth>(`auth/login`, data);
  }



}
