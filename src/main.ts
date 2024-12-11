import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Importa el provider de routing
import { routes } from './app/app.routes';
import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from './app/core/services/state/auth.interceptor'; // Importa las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configura las rutas usando el provider
    importProvidersFrom(HttpClientModule), provideAnimationsAsync(), // Provee HttpClientModule para toda la app
    provideHttpClient(
      withInterceptors([authInterceptor]) // Registra el interceptor aquí
    )
  ],
}).catch((err) => console.error(err));
