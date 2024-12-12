import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormApiService } from '../../core/services/api/form-api.service';
import { StateService } from '../../core/services/state/state.service';
import { Router } from '@angular/router';
import { IHeatMap,Question } from './heat-map.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [NgStyle, CommonModule, MatProgressSpinner],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements OnInit {
  heatMap!: IHeatMap;
  formId!: number;
  isLoading = true;
  initialData = true;
  currentQuestionIndex = 0;
  totalQuestions!: number;
  constructor(    private formApiService: FormApiService,
                  private stateService: StateService,
                  private router: Router,
  ) {}

  ngOnInit(): void {
    this.stateService.getFormId().subscribe(id => {
      if (id !== null) {
        this.formId = id;
        this.formApiService.getHeatMap(this.formId).subscribe({
          next: (heatMap: IHeatMap) => {
            this.heatMap = heatMap;
            this.isLoading = false;
            this.totalQuestions = heatMap.questions.length;

          },
          error: (error) => {
            // console.error('Error al obtener el formulario:', error);
            this.router.navigate(['/admin']);}
        });
      } else {
        // console.error('Error: No se encontró formId en el servicio de estado.');
        this.router.navigate(['/admin']);
      }
    });
  }

  get currentQuestion(): Question {
    return this.heatMap.questions[this.currentQuestionIndex];
  }

  showHeatMaps(){
    this.initialData = false;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
    } else {
      this.initialData = true;
    }
  }
  nextQuestion(){
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
    } else {

    }
  }
}
