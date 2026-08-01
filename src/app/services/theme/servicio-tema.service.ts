import { Injectable, signal } from '@angular/core';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { TemaConfiguracion } from '../../core/models/tema.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioTema {
  private claveStorageTema = 'smoke_shop_tema_config';

  public temaActual = signal<TemaConfiguracion>({
    colorPrimario: '#D71920',       // Rojo Rebel
    colorSecundario: '#F5B400',     // Dorado Rebel
    colorFondo: '#111111',          // Negro Grafito
    colorTarjetas: '#232323',       // Gris Carbón Metalizado
    colorBotones: '#D71920',        // Rojo Botón
    colorTexto: '#FFFFFF',          // Texto Principal
    colorTextoSecundario: '#C9C9C9',// Texto Secundario
    colorIconos: '#F5B400',         // Iconos Dorados
    logotipoUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=200&q=80',
    faviconUrl: '/assets/icon/favicon.png'
  });

  constructor() {
    this.cargarTema();
  }

  private cargarTema(): void {
    try {
      const refDoc = doc(db, 'configuracion', 'tema');
      onSnapshot(refDoc, (docSnap) => {
        if (docSnap.exists()) {
          const tema = docSnap.data() as TemaConfiguracion;
          this.temaActual.set(tema);
          this.aplicarEstilosCss(tema);
          localStorage.setItem(this.claveStorageTema, JSON.stringify(tema));
        } else {
          setDoc(refDoc, this.temaActual());
        }
      });
      return;
    } catch (e) {
      console.warn('⚠️ Error al escuchar Firestore configuracion/tema:', e);
    }

    const guardado = localStorage.getItem(this.claveStorageTema);
    if (guardado) {
      try {
        const tema = JSON.parse(guardado);
        this.temaActual.set(tema);
        this.aplicarEstilosCss(tema);
      } catch (e) {
        this.aplicarEstilosCss(this.temaActual());
      }
    } else {
      this.aplicarEstilosCss(this.temaActual());
    }
  }

  public aplicarEstilosCss(tema: TemaConfiguracion): void {
    const root = document.documentElement;

    root.style.setProperty('--color-primario', tema.colorPrimario);
    root.style.setProperty('--color-secundario', tema.colorSecundario);
    root.style.setProperty('--color-fondo', tema.colorFondo);
    root.style.setProperty('--color-tarjetas', tema.colorTarjetas);
    root.style.setProperty('--color-botones', tema.colorBotones);
    root.style.setProperty('--color-texto', tema.colorTexto);
    root.style.setProperty('--color-texto-secundario', tema.colorTextoSecundario);
    root.style.setProperty('--color-iconos', tema.colorIconos);

    // Ajustar variables Ionic
    root.style.setProperty('--ion-color-primary', tema.colorPrimario);
    root.style.setProperty('--ion-color-secondary', tema.colorSecundario);
    root.style.setProperty('--ion-background-color', tema.colorFondo);
    root.style.setProperty('--ion-text-color', tema.colorTexto);

    // Cambiar favicon dinámicamente si aplica
    if (tema.faviconUrl) {
      const link: HTMLLinkElement | null = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = tema.faviconUrl;
      }
    }
  }

  public async actualizarTema(nuevoTema: Partial<TemaConfiguracion>): Promise<void> {
    const temaActualizado: TemaConfiguracion = {
      ...this.temaActual(),
      ...nuevoTema
    };
    this.temaActual.set(temaActualizado);
    this.aplicarEstilosCss(temaActualizado);
    localStorage.setItem(this.claveStorageTema, JSON.stringify(temaActualizado));

    try {
      const refDoc = doc(db, 'configuracion', 'tema');
      await setDoc(refDoc, temaActualizado, { merge: true });
    } catch (e) {
      console.error('❌ Error actualizando Firestore configuracion/tema:', e);
    }
  }

  public restaurarTemaPorDefecto(): void {
    const temaDefecto: TemaConfiguracion = {
      colorPrimario: '#D71920',
      colorSecundario: '#F5B400',
      colorFondo: '#111111',
      colorTarjetas: '#232323',
      colorBotones: '#D71920',
      colorTexto: '#FFFFFF',
      colorTextoSecundario: '#C9C9C9',
      colorIconos: '#F5B400',
      logotipoUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=200&q=80',
      faviconUrl: '/assets/icon/favicon.png'
    };
    this.actualizarTema(temaDefecto);
  }
}


