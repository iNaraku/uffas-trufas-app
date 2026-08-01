export interface Administrador {
  uid: string;
  email: string;
  nombre?: string;
  rol: 'ADMIN';
  fechaUltimoAcceso?: string;
}
