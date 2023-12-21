// types/index.ts
export interface ITask {
    id: number;
    title: string;
    completed: boolean;
    breakdown?: string[];
  }
  
  export interface GPTResponse {
    choices: { text: string }[];
  }
  