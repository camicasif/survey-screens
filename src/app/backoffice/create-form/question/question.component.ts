import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton, MatIconButton } from '@angular/material/button';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIcon, MatLabel, MatFormField, MatInput, MatButton, MatIconButton],
  styleUrls: ['./question.component.css'],
})
export class QuestionComponent implements OnInit {
  @Input() formGroup!: FormGroup; // Receives a FormGroup from the parent
  @Output() deleteQuestion = new EventEmitter<void>(); // Emits an event to delete the question

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    const respuestas = this.responses;
    if (respuestas.length === 0) {
      respuestas.push(this.createResponse(false)); // Default response without delete
      respuestas.push(this.createResponse(false)); // Default response without delete
    }
  }

  // Getter for the respuestas FormArray
  get responses(): FormArray {
    return this.formGroup.get('respuestas') as FormArray;
  }

  get canDelete(): boolean {
    const control = this.formGroup.get('canDelete');
    return control ? control.value === true : false;
  }
  // Method to create a new response FormGroup
  createResponse(canDelete: boolean): FormGroup {
    return this.fb.group({
      respuesta: ['', Validators.required],
      canDelete: [canDelete] // Indicates whether the response can be deleted
    });
  }

  // Add a new response to the array (maximum of 4)
  addResponse(): void {
    if (this.responses.length < 4) {
      this.responses.push(this.createResponse(true));
    }
  }

  // Emit an event to delete the question
  removeQuestion(): void {
    this.deleteQuestion.emit();
  }

  removeResponse(index: number): void {
    if (this.responses.at(index).value.canDelete) {
      this.responses.removeAt(index);
    }
  }
}
