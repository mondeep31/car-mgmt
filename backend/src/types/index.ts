export interface UserInput {
    email: string;
    password: string;
    name: string;
  }
  
  export interface CarInput {
    title: string;
    description: string;
    tags: string[];
  }
  
  export interface JwtPayload {
    userId: string;
  }
  