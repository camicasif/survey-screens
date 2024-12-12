import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormApiService } from '../../core/services/api/form-api.service';
import { StateService } from '../../core/services/state/state.service';
import { Answer, FormComplete, Question } from '../../core/models/form.model';
import { Respondent } from '../../core/models/respondent.model';
import { CommonModule } from '@angular/common';
import { SurveyApiService } from '../../core/services/api/survey-api.service';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  standalone: true,
  styleUrls: ['./form.component.css'],
  imports:[CommonModule]
})
export class FormComponent implements OnInit {
  formComplete!: FormComplete;
  formId!: number;
  surveyId!:number;
  respondent!: Respondent;
  isQuizActive = false;            // Controla si la vista de preguntas está activa
  currentQuestionIndex = 0;        // Índice de la pregunta actual
  timerDisplay = '02:00';          // Tiempo mostrado en formato mm:ss
  totalQuestions!: number;         // Total de preguntas
  timer: any;
  showQuestionAndAnswers = false;  // Controla si se muestran las preguntas y respuestas
  mouseCoordinates: { x: number; y: number }[] = [];
  questionStartTime!: number;
  totalQuestionStartTime!: number;
  formCompleted:boolean=false;

  constructor(
    private router: Router,
    private formApiService: FormApiService,
    private surveyApiService: SurveyApiService,
    private stateService: StateService
  ) {}

  ngOnInit(): void {
    this.stateService.getFormId().subscribe(id => {
      if (id !== null) {
        this.formId = id;
        console.log("formId: ", id);
        this.formApiService.getFormWithQuestionsAndAnswers(this.formId).subscribe({
          next: (formComplete: FormComplete) => {
            this.formComplete = formComplete;
            this.totalQuestions = formComplete.questions.length;
          },
          error: (error) => console.error('Error al obtener el formulario:', error)
        });
      } else {
        console.error('Error: No se encontró formId en el servicio de estado.');
      }
    });

    this.stateService.getRespondentData().subscribe(respondentData => {
      if (respondentData) this.respondent = respondentData;
      console.log("RespondentData: ", respondentData);
    });

    this.stateService.getSurveyId().subscribe(surveyId => {
      if (surveyId) this.surveyId = surveyId;
      console.log("surveyid: ", surveyId);
      if (surveyId==null||surveyId<0) this.goBack();
    });
  }

  // Método al hacer clic en "Empezar"
  goToAnswers() {
    this.isQuizActive = true;
  }

  // Método al hacer clic en "Continuar" para iniciar la pregunta
  startQuestion() {
    this.mouseCoordinates = []; // Vaciar coordenadas al iniciar la pregunta
    this.questionStartTime = Date.now();
    this.showQuestionAndAnswers = true;  // Muestra la pregunta y las respuestas
    this.startTimer();                   // Inicia el temporizador
  }

  // Timer de 2 minutos por pregunta
  startTimer() {
    let timeRemaining = 120;

    this.timer = setInterval(() => {
      if (timeRemaining > 0) {
        timeRemaining--;
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        this.timerDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      } else {
        this.nextQuestion();
      }
    }, 1000);
  }

  // Seleccionar respuesta y pasar a la siguiente pregunta
  selectAnswer(answer: Answer) {
    const questionEndTime = Date.now();
    const timeTaken = (questionEndTime - this.questionStartTime);

    this.totalQuestionStartTime = (this.totalQuestionStartTime || 0) + timeTaken;
    console.log("TotalQuestionStartTime:", this.totalQuestionStartTime, "TimeTaken (ms):", timeTaken);
    const currentQuestion = this.formComplete.questions[this.currentQuestionIndex];

    // Crear el objeto DTO para enviar a la API
    const createDecisionDto = {
      surveyId: this.surveyId??-1,
      questionId: currentQuestion.id??-1,
      answerId: answer.id??-1,
      mouseCoordinates: this.mouseCoordinates,
      decisionTime: timeTaken,
    };

    // Enviar la decisión a la API
    this.surveyApiService.createDecision(createDecisionDto).subscribe({
      next: (response) => {
        console.log('Decisión creada exitosamente:', response);
        this.nextQuestion();
      },
      error: (error) => {
        console.error('Error al crear la decisión:', error);
        this.nextQuestion();

      },
    });
  }

  // Cambiar a la siguiente pregunta y reiniciar el flujo
  nextQuestion() {
    this.timerDisplay = '02:00';
    clearInterval(this.timer);            // Detiene el temporizador actual
    this.showQuestionAndAnswers = false;  // Oculta la pregunta y respuestas

    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    } else {
      this.endQuiz();  // Termina el cuestionario al completar todas las preguntas
    }
  }

  reStartQuestion() {
    this.timerDisplay = '02:00';
    clearInterval(this.timer);            // Detiene el temporizador actual
    this.showQuestionAndAnswers = false;  // Oculta la pregunta y respuestas
  }
  // Terminar el cuestionario
  endQuiz() {
    clearInterval(this.timer);
    this.formCompleted = true;
    this.surveyApiService.updateSurvey(this.surveyId,{responseTime:this.totalQuestionStartTime,completed:true}).subscribe({
      next: (response) => {
        console.log('Formulario creado exitosamente:', response);
      },
      error: (error) => {
        console.error('Error al editar formulario:', error);
      },
    });
    // alert('Cuestionario completado');
    // this.router.navigate(['/results']); // Navegar a otra página
  }

  // Getter para obtener la pregunta actual
  get currentQuestion(): Question {
    return this.formComplete.questions[this.currentQuestionIndex];
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
  @HostListener('document:mousemove', ['$event'])
  trackMouse(event: MouseEvent) {
    if (this.showQuestionAndAnswers) {
      this.mouseCoordinates.push({ x: event.clientX, y: event.clientY });
    }
  }
}
