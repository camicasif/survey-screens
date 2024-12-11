import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule, NgStyle } from '@angular/common';

@Component({
  selector: 'app-heatmap',
  standalone: true,
  imports: [NgStyle, CommonModule],
  templateUrl: './heatmap.component.html',
  styleUrls: ['./heatmap.component.css']
})
export class HeatmapComponent implements AfterViewInit {
  @ViewChild('heatmap', { static: true }) heatmapCanvas!: ElementRef<HTMLCanvasElement>;

  private ctx!: CanvasRenderingContext2D;
  private isTracking: boolean = true; // Controla si se sigue capturando el mouse
  mousePath: { x: number; y: number }[] = []; // Arreglo para almacenar las coordenadas

  blocks = [
    { x: 100, y: 100 },
    { x: 300, y: 200 },
    { x: 500, y: 400 }
  ];

  ngAfterViewInit(): void {
    if (this.heatmapCanvas) {
      const canvas = this.heatmapCanvas.nativeElement;
      canvas.width = 800;
      canvas.height = 600;
      this.ctx = canvas.getContext('2d')!;

      // Escuchar el movimiento del mouse
      canvas.addEventListener('mousemove', (event: MouseEvent) => this.trackMouse(event));
    } else {
      console.error('Canvas element not found!');
    }
  }

  // Captura las coordenadas del mouse
  private trackMouse(event: MouseEvent): void {
    if (!this.isTracking) return;

    const canvas = this.heatmapCanvas.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.mousePath.push({ x, y }); // Guarda las coordenadas
  }

  // Dibuja una línea hacia el bloque seleccionado
  onBlockClick(block: { x: number; y: number }): void {
    this.isTracking = false; // Detener el seguimiento del mouse

    const blockCenter = {
      x: block.x + 25,
      y: block.y + 25
    };

    // Dibujar el camino del mouse
    this.drawMousePath();

    // Dibujar línea hacia el bloque
    this.drawLine(this.mousePath[this.mousePath.length - 1], blockCenter);
  }

  // Dibuja el camino completo del mouse
  private drawMousePath(): void {
    if (this.mousePath.length < 2) return;

    this.ctx.beginPath();
    this.ctx.moveTo(this.mousePath[0].x, this.mousePath[0].y);

    for (const point of this.mousePath) {
      this.ctx.lineTo(point.x, point.y);
    }

    this.ctx.strokeStyle = 'blue';
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
  }

  // Dibuja una línea en el canvas
  private drawLine(start: { x: number; y: number }, end: { x: number; y: number }): void {
    this.ctx.beginPath();
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
  }
}
