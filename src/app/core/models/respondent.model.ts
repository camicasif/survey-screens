export interface Respondent {
  id: number;
  ci: number;
  name: string;
  surname: string;
  age: number;
  career: Partial<Career> | null;
}


export interface Career {
  id: number;
  name: string;
  description: string;
}
