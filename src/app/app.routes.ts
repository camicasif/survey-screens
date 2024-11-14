import { Routes } from '@angular/router';
import { QuestionPageComponent } from './features/question-page/question-page.component';
import { AnswersPageComponent } from './features/answers-page/answers-page.component';
import { RespondentComponent } from './features/respondent/respondent.component';

export const routes: Routes = [
  { path: 'respondent-form', component: RespondentComponent, pathMatch: 'full' },
  { path: 'question-page', component: QuestionPageComponent, pathMatch: 'full' },
  { path: 'answers-page', component: AnswersPageComponent },
  { path: '', redirectTo: 'respondent-form', pathMatch: 'full' }, // Redirección por defecto
];
