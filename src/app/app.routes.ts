import { Routes } from '@angular/router';
import { RespondentComponent } from './features/respondent/respondent.component';
import { FormComponent } from './features/form/form.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { SidenavLayoutComponent } from './layouts/sidenav-layout/sidenav-layout.component';
import { HomeComponent } from './backoffice/home/home.component';
import { CreateFormComponent } from './backoffice/create-form/create-form.component';
import { LoginComponent } from './backoffice/login/login.component';
import { authGuard } from './core/services/state/auth.guard.service';
import { HeatmapComponent } from './backoffice/heatmap/heatmap.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'respondent-form',
    pathMatch: 'full', // Redirige la ruta raíz a 'respondent-form'
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: SidenavLayoutComponent, // Layout con sidenav
    canActivate: [authGuard],
    children: [
      { path: 'admin', component: HomeComponent },
      { path: 'create-edit-form', component: CreateFormComponent },
      { path: 'heatmap', component: HeatmapComponent },


    ],
  },
  {
    path: '',
    component: BlankLayoutComponent, // Layout sin sidenav
    children: [
      { path: 'respondent-form', component: RespondentComponent },
      { path: 'form', component: FormComponent },
    ],
  },
  {
    path: '**', // Ruta comodín para manejar rutas desconocidas
    redirectTo: 'respondent-form',
  },
];
