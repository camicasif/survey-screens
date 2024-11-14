import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router'; // Importa RouterModule y RouterOutlet
import { routes } from './app.routes'; // Importa las rutas desde el archivo de rutas

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule], // Agrega RouterModule a los imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'eco-experimental-game';
}
