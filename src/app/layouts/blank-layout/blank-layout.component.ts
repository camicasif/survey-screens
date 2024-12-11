import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-blank-layout',
  standalone: true,
  templateUrl: './blank-layout.component.html',
  styleUrls: ['./blank-layout.component.css'],
  imports: [
    RouterOutlet,
  ],
})
export class BlankLayoutComponent {}
