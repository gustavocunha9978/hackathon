export interface IUserDTO {
  id: string;
  name?: string | undefined;
  email: string;
  sector: 'education' | 'Directors'; // MUDAR education PARA O SETOR DO MÓDULO (MESMO DO AD)
}
