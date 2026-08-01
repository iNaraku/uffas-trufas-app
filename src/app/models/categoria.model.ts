export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  icono?: string;
  orden: number;
  activa: boolean;
}
