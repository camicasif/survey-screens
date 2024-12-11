import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { QuestionComponent } from './question/question.component';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { FormComplete } from '../../core/models/form.model';
import { FormApiService } from '../../core/services/api/form-api.service';
import { Router } from '@angular/router';
import Notiflix from 'notiflix';
import { StateService } from '../../core/services/state/state.service';

@Component({
  selector: 'app-formulario',
  templateUrl: './create-form.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, QuestionComponent, MatFormField, MatInput, MatButton, MatLabel],
  styleUrls: ['./create-form.component.css'],
})
export class CreateFormComponent implements OnInit {

  formComplete!: FormComplete;
  formId!: number;
  formulario!: FormGroup;
  @ViewChild('preguntasContainer') preguntasContainer!: ElementRef;


  constructor(private fb: FormBuilder,
              private formApiService: FormApiService,
              private router: Router,
              private stateService: StateService
  ) {}

  ngOnInit(): void {

    this.formulario = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descripcion: [''],
      preguntas: this.fb.array([]),
    });
    this.stateService.getFormId().subscribe(id => {
      console.log("formId en create-form:", id);
      if (id != null ) {
        this.formId = id;
        // Modo edición: cargar el formulario existente
        this.formApiService.getFormWithQuestionsAndAnswers(this.formId).subscribe({
          next: (formComplete: FormComplete) => {
            this.formComplete = formComplete;
            this.populateForm(formComplete); // Cargar datos en el formulario
          },
          error: (error) => console.error('Error al obtener el formulario:', error),
        });
      } else {
        // Modo creación: inicializar con preguntas predeterminadas
        this.initializeForm();
      }
    });

  }

  private initializeForm(): void {
    this.formulario = this.fb.group({
      id: [null],
      titulo: ['', Validators.required],
      descripcion: [''],
      preguntas: this.fb.array([]),
    });

    // Agregar 5 preguntas predeterminadas
    for (let i = 0; i < 5; i++) {
      this.agregarPregunta(false);
    }
  }


  private populateForm(formComplete: FormComplete): void {
    this.formulario = this.fb.group({
      id: [formComplete.id],
      titulo: [formComplete.title, Validators.required],
      descripcion: [formComplete.description],
      preguntas: this.fb.array([]), // Se rellenará con las preguntas existentes
    });

    formComplete.questions.forEach((question) => {
      const questionGroup = this.fb.group({
        id: [question.id],
        pregunta: [question.description, Validators.required],
        respuestas: this.fb.array(
          question.answers.map((answer) =>
            this.fb.group({
              id: [answer.id],
              respuesta: [answer.description, Validators.required],
            })
          )
        ),
        canDelete: [false],
      });
      this.preguntas.push(questionGroup);
    });
  }
  // Getter for preguntas FormArray
  get preguntas(): FormArray {
    return this.formulario.get('preguntas') as FormArray;
  }

  // Add a new question
  agregarPregunta(canDelete:boolean): void {
    const questionGroup = this.fb.group({
      id: [null], // Null indica una nueva pregunta
      pregunta: ['', Validators.required],
      respuestas: this.fb.array([]),
      canDelete: [canDelete],
    });
    this.preguntas.push(questionGroup);
    if (canDelete)
      setTimeout(() => this.scrollToBottom(), 0);
  }

  private scrollToBottom(): void {
    if (this.preguntasContainer) {
      const element = this.preguntasContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }

  getPregunta(index: number): FormGroup {
    return this.preguntas.at(index) as FormGroup;
  }
  // Remove a question at a specific index
  eliminarPregunta(index: number): void {
    this.preguntas.removeAt(index);
  }

  private mapToFormComplete(): FormComplete {
    return {
      id: this.formulario.value.id,
      title: this.formulario.value.titulo,
      description: this.formulario.value.descripcion,
      isOpen: true,
      questions: this.preguntas.value.map((pregunta: any) => ({
        id: pregunta.id,
        description: pregunta.pregunta,
        answers: pregunta.respuestas.map((respuesta: any) => ({
          id: respuesta.id,
          description: respuesta.respuesta,
        })),
      })),
    };
  }
  // Submit the form
  guardarFormulario(): void {
    if (this.formulario.invalid) {
      console.error('Formulario inválido');
      return;
    }

    const formComplete: FormComplete = this.mapToFormComplete();

    this.formApiService.createOrUpdateForm(formComplete).subscribe({
      next: (survey) => {
        this.router.navigate(['/admin']); // Navega a la pantalla del formulario
      },
      error: (errorResponse) => {
        const errorMessage = errorResponse?.message || 'Hubo un error al enviar los datos. Contacte con el administrador.';
        Notiflix.Report.failure(
          'Error al guardar el formulario',
          errorMessage,
          'Cerrar'
        );
      }
    });
  }
}
