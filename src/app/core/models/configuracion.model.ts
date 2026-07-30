export interface ConfiguracionSitio {
  nombreTienda: string;
  eslogan: string;
  telefonoWhatsapp: string;
  direccion: string;
  horarios: string;
  instagram: string;
  facebook: string;
  mensajeBienvenida: string;
}

export interface ConfiguracionHome {
  bannerPrincipalId?: string;
  tituloCarrusel: string;
  textoPrincipal: string;
  textoSecundario: string;
  anuncioAlert?: string;
  mostrarAnuncio: boolean;
}
