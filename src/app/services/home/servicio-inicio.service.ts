import { Injectable, signal } from '@angular/core';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ConfiguracionHome } from '../../models/configuracion.model';
import { db } from '../../config/firebase';

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
    // Cargar caché local primero para inicio rápido
    const local = localStorage.getItem(this.claveStorageHome);
    if (local) {
      try {
        this.configuracionHome.set(JSON.parse(local));
      } catch (e) { }
    }

    // Escuchar cambios en tiempo real desde Firestore
    try {
      const refDoc = doc(db, 'configuracion', 'home');
      onSnapshot(refDoc, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data() as ConfiguracionHome;
          this.configuracionHome.set(data);
          localStorage.setItem(this.claveStorageHome, JSON.stringify(data));
        } else {
          // Si el documento aún no existe en Firestore, lo crea con la configuración por defecto
          setDoc(refDoc, this.configuracionHome());
        }
      });
    } catch (e) {
      console.error('❌ Error al escuchar Firestore configuracion/home:', e);
    }
  }

  public async actualizarConfiguracionHome(datos: Partial<ConfiguracionHome>): Promise<void> {
    const actualizada = { ...this.configuracionHome(), ...datos };
    this.configuracionHome.set(actualizada);
    localStorage.setItem(this.claveStorageHome, JSON.stringify(actualizada));

    try {
      const refDoc = doc(db, 'configuracion', 'home');
      await setDoc(refDoc, actualizada, { merge: true });
    } catch (e) {
      console.error('❌ Error actualizando Firestore configuracion/home:', e);
    }
  }
}

