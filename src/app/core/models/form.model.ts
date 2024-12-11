export interface SimpleForm {
  id: number;
  title: string;
}

export interface AuthData {
  email: string;
  password: string;
}

export interface ResponseAuth {
  accessToken: string;
}

export interface Form {
  id: number;
  title: string;
  description: string;
  isOpen: boolean;
  nTimesTaken:number;
}

export interface FormComplete {
  id: number|null;
  title: string;
  description: string;
  isOpen?: boolean;
  nTimesTaken?:number;
  questions: Question[]
}
export interface Question {
  id:number|null;
  description: string;
  answers: Answer[];
}

export interface Answer{
  id: number|null;
  description: string;

}
