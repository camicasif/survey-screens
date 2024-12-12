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
export class HeatmapComponent implements OnInit, AfterViewInit  {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  heatMap!: IHeatMap;
  formId!: number;
  isLoading = true;
  initialData = true;
  currentQuestionIndex = 0;
  totalQuestions!: number;

  private ctx!: CanvasRenderingContext2D;

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

  ngAfterViewInit(): void {
    this.initCanvas();
  }


  private initCanvas(): void {

    if (!this.canvas) {
      console.error('Canvas element not found!');
      return;
    }

    if (this.canvas) {
      const canvasEl = this.canvas.nativeElement;
      canvasEl.width = window.innerWidth;
      canvasEl.height = window.innerHeight;
      this.ctx = canvasEl.getContext('2d')!;
      console.log('Canvas was inited')

    }
  }


  get currentQuestion(): Question {
    return this.heatMap.questions[this.currentQuestionIndex];
  }

  private drawLines(): void {
    if (!this.ctx) return;
    console.log("THIS.CTX EXIST")
    const canvas = this.canvas.nativeElement;
    const decisions = this.currentQuestion.decisions;

    // Limpiar canvas
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar líneas basadas en las coordenadas del mouse
    decisions.forEach(decision => {
      if (decision.mouseCoordinates.length > 1) {
        this.ctx.beginPath();
        const coordinates = decision.mouseCoordinates;

        this.ctx.moveTo(coordinates[0].x, coordinates[0].y); // Punto inicial
        for (let i = 1; i < coordinates.length; i++) {
          this.ctx.lineTo(coordinates[i].x, coordinates[i].y); // Conectar puntos
        }

        this.ctx.strokeStyle = '#0d6efd'; // Color de línea
        this.ctx.lineWidth = 2; // Grosor de línea
        this.ctx.stroke();
      }
    });
  }


  showHeatMaps(){
    this.initialData = false;
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.drawLines();
    } else {
      this.initialData = true;
    }
  }
  nextQuestion(){
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.drawLines();
    } else {

    }
  }
}
