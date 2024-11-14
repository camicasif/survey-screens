export interface Survey {
  id: number;
  formId: number;
  respondentId: number;
  responseTime?: number; // Opcional, si la respuesta puede ser null inicialmente
  completed: boolean;
}

export interface Decision {
  id: number;
  surveyId: number;
  questionId: number;
  answerId: number;
  mouseCoordinates: { x: number; y: number }[]; // Array de coordenadas de ratón
  decisionTime: number; // Tiempo de decisión en milisegundos
}
export interface CreateSurveyDto {
  formId: number;
  respondentId: number;
}

export interface UpdateSurveyDto {
  responseTime?: number; // Opcional, si no siempre se actualiza
  completed: boolean;
}

export interface CreateDecisionDto {
  surveyId: number;
  questionId: number;
  answerId: number;
  mouseCoordinates: { x: number; y: number }[]; // Array de puntos de coordenadas
  decisionTime: number;
}
