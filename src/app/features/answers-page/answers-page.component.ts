import { Component } from '@angular/core';
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-answers-page',
  templateUrl: './answers-page.component.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./answers-page.component.css']
})
export class AnswersPageComponent {
  question = '¿Cuál es la capital de Francia?';
  answers = ['Madrid', 'París', 'Roma'];
}
