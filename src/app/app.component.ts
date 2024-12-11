import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Importa RouterModule y RouterOutlet
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from './core/services/state/auth.interceptor'; // Importa las rutas desde el archivo de rutas

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Agrega RouterModule a los imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  // providers: [
  //   {
  //     provide: HTTP_INTERCEPTORS,
  //     useClass: AuthInterceptor,
  //     multi: true
  //   }
  // ],
})
export class AppComponent {
  title = 'eco-experimental-game';
}
