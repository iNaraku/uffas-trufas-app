import { Injectable, signal } from '@angular/core';
import { ConfiguracionHome } from '../../models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioInicio {
  private claveStorageHome = 'smoke_shop_home_config';

  public configuracionHome = signal<ConfiguracionHome>({
    bannerPrincipalId: 'ban-1',
    tituloCarrusel: 'Productos Destacados & Novedades',
    textoPrincipal: 'EXPLORA NUESTRA COLECCIÓN REBEL',
    textoSecundario: 'Diseño urbano, acabados prémium y herramientas de parafernalia de máxima calidad.',
    anuncioAlert: '🔥 Envío discreto en todas las compras vía WhatsApp y entregas locales inmediatas.',
    mostrarAnuncio: true
  });

  constructor() {
    this.cargarConfiguracionHome();
  }

  private cargarConfiguracionHome(): void {
    const local = localStorage.getItem(this.claveStorageHome);
    if (local) {
      try {
        this.configuracionHome.set(JSON.parse(local));
      } catch (e) { }
    }
  }

  public actualizarConfiguracionHome(datos: Partial<ConfiguracionHome>): void {
    const actualizada = { ...this.configuracionHome(), ...datos };
    this.configuracionHome.set(actualizada);
    localStorage.setItem(this.claveStorageHome, JSON.stringify(actualizada));
  }
}
