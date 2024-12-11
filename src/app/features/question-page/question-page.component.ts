import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-question-page',
  templateUrl: './question-page.component.html',
  standalone: true,
  styleUrls: ['./question-page.component.css']
})
export class QuestionPageComponent {

  question = '¿Cuál es la capital de Francia?';

  constructor(private router: Router,
              private route: ActivatedRoute) {}

  goToAnswers() {
    this.router.navigate(['/answers-page']);
  }
}
