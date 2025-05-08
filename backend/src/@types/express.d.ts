/* eslint-disable @typescript-eslint/naming-convention */
declare namespace Express {
  // anexa o que for colocado aqui dentro no Request
  export interface Request {
    user: {
      id?: string;
      email: string;
      name: string;
      sector: 'education' | 'Directors';
    };
  }
}
