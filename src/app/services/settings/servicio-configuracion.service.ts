import { Injectable, signal } from '@angular/core';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ConfiguracionSitio } from '../../models/configuracion.model';
import { db } from '../../config/firebase';

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
    try {
      const refDoc = doc(db, 'configuracion', 'tienda');
      onSnapshot(refDoc, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ConfiguracionSitio;
          this.configuracion.set(data);
          localStorage.setItem(this.claveStorageConfig, JSON.stringify(data));
        } else {
          setDoc(refDoc, this.configuracion());
        }
      });
      return;
    } catch (e) {
      console.warn('⚠️ Error al escuchar Firestore configuracion/tienda:', e);
    }

    const local = localStorage.getItem(this.claveStorageConfig);
    if (local) {
      try {
        this.configuracion.set(JSON.parse(local));
      } catch (e) { }
    }
  }

  public async actualizarConfiguracion(datos: Partial<ConfiguracionSitio>): Promise<void> {
    const actualizada = { ...this.configuracion(), ...datos };
    this.configuracion.set(actualizada);
    localStorage.setItem(this.claveStorageConfig, JSON.stringify(actualizada));

    try {
      const refDoc = doc(db, 'configuracion', 'tienda');
      await setDoc(refDoc, actualizada, { merge: true });
    } catch (e) {
      console.error('❌ Error actualizando Firestore configuracion/tienda:', e);
    }
  }
}


