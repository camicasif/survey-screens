import { Component, OnInit } from '@angular/core';
import { FormApiService } from '../../core/services/api/form-api.service';
import { CommonModule, NgForOf, NgIf } from '@angular/common';
import { Form } from '../../core/models/form.model';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatList, MatListItem } from '@angular/material/list';
import { MatButton, MatIconButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { StateService } from '../../core/services/state/state.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatButton,
    MatIcon,
    MatIconButton,
    MatList,
    MatProgressSpinner,
    MatSlideToggle,
    NgForOf,
    NgIf,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{
  forms: Form[] = [];
  isLoading = true;

  constructor(private formApiService: FormApiService,
              private router: Router,
              private stateService: StateService,
  ) {}

  ngOnInit(): void {
    this.fetchForms();
  }

  fetchForms(): void {
    this.formApiService.getAllForms().subscribe({
      next: (data) => {
        this.forms = data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al obtener los formularios:', error);
        this.isLoading = false;
      },
    });
  }

  toggleFormStatus(form: Form): void {
    const updatedForm = { ...form, isOpen: !form.isOpen };
    this.formApiService.updateFormStatus(form.id, updatedForm.isOpen).subscribe({
      next: () => {
        form.isOpen = updatedForm.isOpen;
      },
      error: (error) => {
        console.error('Error al cambiar el estado del formulario:', error);
      },
    });
  }

  editForm(form: Form): void {
    // Implementa la lógica para abrir un modal o navegar a la página de edición del formulario
    this.stateService.setFormId(form.id);
    console.log("StateService: ", form);
    this.router.navigate(['/create-edit-form']);
    console.log('Editar formulario:', form);
  }

  addForm(): void {
    console.log('Agregar formulario');
    this.stateService.setFormId(null);
    this.router.navigate(['/create-edit-form']);
    // Implementa la lógica para abrir un modal o navegar a la página de creación de formulario
  }


  viewHeatMap(form: any) {
    this.stateService.setFormId(form.id);
    this.router.navigate(['/heatmap']);
  }
}
