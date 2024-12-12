import { Answer } from '../../core/models/form.model';


export interface IHeatMap {
  formId: number;
  title: string;
  nTimesTaken: number;
  isOpen: boolean;
  description: string;
  questions: Question[];
}

export interface Question {
  id: number;
  description: string;
  decisions: Decision[];
  answers: Answer[];
}

export interface Decision {
  mouseCoordinates: { x: number; y: number }[];
  decisionTime: number;
  idAnswer: number;
}
