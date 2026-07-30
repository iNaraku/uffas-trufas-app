import { Injectable, signal } from '@angular/core';
import { ConfiguracionSitio } from '../../core/models/configuracion.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioConfiguracion {
  private claveStorageConfig = 'smoke_shop_sitio_config';

  public configuracion = signal<ConfiguracionSitio>({
    nombreTienda: 'REBEL SMOKE SHOP',
    eslogan: 'Premium Parafernalia & Urban Lifestyle',
    telefonoWhatsapp: '+52 55 9988 7766',
    direccion: 'Av. Rebelde 420, Zona Urbana, CDMX',
    horarios: 'Lunes a Sábado: 11:00 AM - 10:00 PM',
    instagram: '@rebelsmokeshop',
    facebook: '/rebelsmokeshop',
    mensajeBienvenida: 'Bienvenido al catálogo digital de Rebel Smoke Shop. Consulta nuestros productos disponibles.'
  });

  constructor() {
    this.cargarConfiguracion();
  }

  private cargarConfiguracion(): void {
    const local = localStorage.getItem(this.claveStorageConfig);
    if (local) {
      try {
        this.configuracion.set(JSON.parse(local));
      } catch (e) {}
    }
  }

  public actualizarConfiguracion(datos: Partial<ConfiguracionSitio>): void {
    const actualizada = { ...this.configuracion(), ...datos };
    this.configuracion.set(actualizada);
    localStorage.setItem(this.claveStorageConfig, JSON.stringify(actualizada));
  }
}
