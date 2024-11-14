import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http/http.service';
import { Form } from '../../models/form.model';
@Injectable({
  providedIn: 'root'
})
export class FormApiService {
  private baseUrl = 'form';

  constructor(private httpService: HttpService) {}


  getAllFormsOpen(): Observable<Form[]> {
    return this.httpService.get<Form[]>(`${this.baseUrl}`);
  }
}
