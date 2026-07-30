export type VisibilidadProducto = 'PUBLIC' | 'PRIVATE';
export type EstadoProducto = 'ACTIVE' | 'INACTIVE';

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string;
  categoriaId: string;
  categoriaNombre?: string;
  precio: number;
  imagenUrl: string;
  disponible: boolean;
  destacado: boolean;
  orden: number;
  visibilidad: VisibilidadProducto;
  estado: EstadoProducto;
  fechaCreacion: string;
  fechaActualizacion: string;
}
