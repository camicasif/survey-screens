import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormApiService } from '../../core/services/api/form-api.service';
import { StateService } from '../../core/services/state/state.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  styleUrls: ['./login.component.css'],
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder,
              private formApiService: FormApiService,
              private stateService: StateService,
              private router: Router,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.formApiService.login({ email, password }).subscribe({
        next: (response) => {
          // Guardar el token en el servicio de estado
          this.stateService.setAccessToken(response.accessToken);

          // Redirigir al usuario a la pantalla 'admin'
          this.router.navigate(['/admin']);
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          this.errorMessage = 'Credenciales incorrectas. Inténtalo nuevamente.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, completa todos los campos correctamente.';
    }
  }
}
