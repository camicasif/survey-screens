import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Career } from '../../core/models/respondent.model';
import { RespondentApiService } from '../../core/services/api/respondent-api.service';
import { Form } from '../../core/models/form.model';
import { FormApiService } from '../../core/services/api/form-api.service';
import { forkJoin, switchMap } from 'rxjs';
import Notiflix from 'notiflix';
import { SurveyApiService } from '../../core/services/api/survey-api.service';

@Component({
  selector: 'app-respondent',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './respondent.component.html',
  styleUrls: ['./respondent.component.css']
})
export class RespondentComponent implements OnInit{
  respondentForm: FormGroup;
  careers: Career[] = [];
  forms: Form[] = [];

  isLoading = true;
  constructor(
    private fb: FormBuilder,
    private respondentApiService: RespondentApiService,
    private formApiService: FormApiService,
    private surveyApiService: SurveyApiService

  ) {
    this.respondentForm = this.fb.group({
      id: [null],
      ci: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      name: ['', [Validators.required, Validators.maxLength(255)]],
      surname: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(16), Validators.max(120)]],
      careerId: ['', Validators.required],
      formId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    forkJoin({
      careers: this.respondentApiService.getAllCareers(),
      forms: this.formApiService.getAllFormsOpen()
    }).subscribe({
      next: (results) => {
        this.careers = results.careers;
        this.forms = results.forms;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        Notiflix.Report.failure(
          'Error en el servidor',
          'Hubo un error al cargar los formularios y las carreras. Contacte con el administrador.',
          'Cerrar'
        );
      }
    });
  }
  onBlurCI(): void {
    const ci = this.respondentForm.get('ci')?.value;
    if (ci) {
      this.respondentApiService.getRespondentByCI(ci).subscribe({
        next: (respondent) => {
          // Autocompleta el formulario con los datos obtenidos
          this.respondentForm.patchValue({
            id: respondent.id,
            name: respondent.name,
            surname: respondent.surname,
            age: respondent.age,
            careerId: respondent.career?.id
          });
        },
        error: () => {
          // No se hace nada si ocurre un error
        }
      });
    }
  }

  submitForm(): void {
    if (this.respondentForm.valid) {
      const { id, ci, name, surname, age, careerId } = this.respondentForm.value;
      const formId = this.respondentForm.get('formId')?.value;
      console.log("Form:", formId, this.respondentForm.get('form'))

      const respondentData = {
        id,  // Incluye el ID solo si existe
        ci,
        name,
        surname,
        age,
        career: { id: careerId}  // Solo envía el id de la carrera
      };
      this.respondentApiService.createOrUpdateRespondent(respondentData).pipe(
        switchMap((respondent) => {
          const respondentId = respondent.id; // ID del respondent creado o actualizado
          return this.surveyApiService.createSurvey({ formId, respondentId });
        })
      ).subscribe({
        next: () => {
          Notiflix.Report.success(
            'Encuesta creada',
            'La encuesta se ha creado exitosamente.',
            'Cerrar'
          );
        },
        error: () => {
          Notiflix.Report.failure(
            'Error en el servidor',
            'Hubo un error al enviar los datos. Contacte con el administrador.',
            'Cerrar'
          );
        }
      });
    }

  }
}
