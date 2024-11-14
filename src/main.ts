import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router'; // Importa el provider de routing
import { routes } from './app/app.routes';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core'; // Importa las rutas

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Configura las rutas usando el provider
    importProvidersFrom(HttpClientModule) // Provee HttpClientModule para toda la app

  ],
}).catch((err) => console.error(err));
