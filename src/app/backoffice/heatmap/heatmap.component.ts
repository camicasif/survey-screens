import { Component, AfterViewInit, ElementRef, ViewChild, OnInit } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';
import { FormApiService } from '../../core/services/api/form-api.service';
import { StateService } from '../../core/services/state/state.service';
import { Router } from '@angular/router';
import { IHeatMap, Question } from './heat-map.interface';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [NgStyle, CommonModule, MatProgressSpinner],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css'],
})
export class HeatmapComponent implements OnInit, AfterViewInit {
  @ViewChild('canvas', { static: false }) canvas!: ElementRef<HTMLCanvasElement>;
  heatMap!: IHeatMap;
  formId!: number;
  isLoading = true;
  initialData = true;
  currentQuestionIndex = 0;
  totalQuestions!: number;

  private ctx!: CanvasRenderingContext2D;

  constructor(private formApiService: FormApiService,
              private stateService: StateService,
              private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.stateService.getFormId().subscribe(id => {
      if (id !== null) {
        this.formId = id;
        this.formApiService.getHeatMap(this.formId).subscribe({
          next: (heatMap: IHeatMap) => {
            this.heatMap = heatMap;
            this.isLoading = false;
            this.initCanvas();
            this.totalQuestions = heatMap.questions.length;

          },
          error: (error) => {
            // console.error('Error al obtener el formulario:', error);
            this.router.navigate(['/admin']);
          },
        });
      } else {
        // console.error('Error: No se encontró formId en el servicio de estado.');
        this.router.navigate(['/admin']);
      }
    });
  }

  ngAfterViewInit(): void {
    // this.initCanvas();
  }


  private initCanvas(): void {

    if (!this.canvas) {
      console.error('Canvas element not found!');
      return;
    }

    const canvasEl = this.canvas.nativeElement;
    canvasEl.width = window.innerWidth;
    canvasEl.height = window.innerHeight;
    this.ctx = canvasEl.getContext('2d')!;
    console.log('Canvas was inited');

  }


  get currentQuestion(): Question {
    return this.heatMap.questions[this.currentQuestionIndex];
  }

  private drawLines(): void {
    if (!this.ctx) return;
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


  showHeatMaps() {
    this.initialData = false;
    this.drawLines();
  }

  previousQuestion() {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.drawLines();
    } else {
      this.initialData = true;
      if (!this.ctx) return;
      const canvas = this.canvas.nativeElement;
      this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    }
  }

  nextQuestion() {
    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++;
      this.drawLines();
    } else {

    }
  }


  async downloadHeatMaps() {
    const pdf = new jsPDF();
    this.initialData = false;

    for (let i = 0; i < this.heatMap.questions.length; i++) {
      this.currentQuestionIndex = i;
      this.drawLines();

      // Esperar para asegurarte de que todo esté renderizado correctamente
      await new Promise((resolve) => setTimeout(resolve, 500));

      const principalContainer = document.getElementById('principal-container') as HTMLElement;

      if (!principalContainer) {
        console.error('El contenedor principal no se encontró.');
        return;
      }

      try {
        // Capturar todo el contenedor principal como una imagen
        const screenshot = await html2canvas(principalContainer, {
          backgroundColor: null, // Mantener fondo transparente si es necesario
          scale: 2, // Aumentar resolución para mejor calidad
          useCORS: true, // Incluir imágenes externas si es necesario
          logging: false, // Desactiva logs de html2canvas
        });

        // Convertir la captura a un Data URL
        const imgData = screenshot.toDataURL('image/png');

        // Determinar la posición de la imagen en la página
        const isOdd = i % 2 === 0; // Determina si es la primera o segunda imagen en la página
        const yPosition = isOdd ? 10 : 150; // Primera imagen en la parte superior, segunda en la parte inferior

        // Agregar la imagen al PDF
        if (isOdd && i > 0) {
          pdf.addPage(); // Agregar nueva página después de dos imágenes
        }
        pdf.addImage(imgData, 'PNG', 10, yPosition, 190, 130); // Ajustar posición y tamaño
      } catch (error) {
        console.error(`Error capturando la pregunta ${i + 1}:`, error);
      }
    }

    // Descargar el PDF
    pdf.save('heatmaps.pdf');
  }


}
