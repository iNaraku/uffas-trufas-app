export interface Banner {
  id: string;
  titulo: string;
  subtitulo: string;
  imagenUrl: string;
  textoBoton?: string;
  enlaceBoton?: string;
  orden: number;
  activo: boolean;
  destacado: boolean;
}
