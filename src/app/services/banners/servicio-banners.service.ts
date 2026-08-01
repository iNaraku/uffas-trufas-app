import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Banner } from '../../core/models/banner.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioBanners {
  private claveStorageBanners = 'smoke_shop_banners';

  public banners = signal<Banner[]>([]);

  private bannersIniciales: Banner[] = [
    {
      id: 'ban-1',
      titulo: 'REBEL SMOKE CATALOG',
      subtitulo: 'Colección urbana de parafernalia premium y cristalería exclusiva.',
      imagenUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
      textoBoton: 'Ver Catálogo',
      enlaceBoton: '/catalogo',
      orden: 1,
      activo: true,
      destacado: true
    },
    {
      id: 'ban-2',
      titulo: 'ZONA PRIVADA VIP 🔒',
      subtitulo: 'Ingresa tu PIN autorizado para desbloquear bongs, rigs y extractos.',
      imagenUrl: 'https://images.unsplash.com/photo-1527016021513-b09758b777bd?auto=format&fit=crop&w=1200&q=80',
      textoBoton: 'Desbloquear PIN',
      enlaceBoton: '/desbloqueo',
      orden: 2,
      activo: true,
      destacado: true
    }
  ];

  constructor() {
    this.cargarBanners();
  }

  private cargarBanners(): void {
    try {
      const refColeccion = collection(db, 'banners');
      onSnapshot(refColeccion, (snapshot) => {
        if (!snapshot.empty) {
          const lista: Banner[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
          this.banners.set(lista);
          this.guardarBanners(lista);
        } else {
          this.bannersIniciales.forEach(b => {
            const refDoc = doc(db, 'banners', b.id);
            setDoc(refDoc, b);
          });
          this.banners.set(this.bannersIniciales);
        }
      });
      return;
    } catch (e) {
      console.warn('⚠️ Error al escuchar Firestore banners:', e);
    }

    const local = localStorage.getItem(this.claveStorageBanners);
    if (local) {
      try {
        this.banners.set(JSON.parse(local));
      } catch (e) {
        this.banners.set(this.bannersIniciales);
        this.guardarBanners(this.bannersIniciales);
      }
    } else {
      this.banners.set(this.bannersIniciales);
      this.guardarBanners(this.bannersIniciales);
    }
  }

  private guardarBanners(list: Banner[]): void {
    localStorage.setItem(this.claveStorageBanners, JSON.stringify(list));
  }

  public obtenerBannersActivos(): Banner[] {
    return this.banners()
      .filter(b => b.activo)
      .sort((a, b) => a.orden - b.orden);
  }

  public async crearBanner(nuevo: Omit<Banner, 'id'>): Promise<Banner> {
    const id = 'ban-' + Date.now();
    const banner: Banner = { ...nuevo, id };

    try {
      const refDoc = doc(db, 'banners', id);
      await setDoc(refDoc, banner);
    } catch (e) {
      console.error('❌ Error al crear banner en Firestore:', e);
    }

    const lista = [...this.banners(), banner];
    this.banners.set(lista);
    this.guardarBanners(lista);
    return banner;
  }

  public async actualizarBanner(id: string, datos: Partial<Banner>): Promise<boolean> {
    try {
      const refDoc = doc(db, 'banners', id);
      await updateDoc(refDoc, datos);
    } catch (e) {
      console.error('❌ Error al actualizar banner en Firestore:', e);
    }

    const lista = this.banners().map(b => b.id === id ? { ...b, ...datos } : b);
    this.banners.set(lista);
    this.guardarBanners(lista);
    return true;
  }

  public async eliminarBanner(id: string): Promise<boolean> {
    try {
      const refDoc = doc(db, 'banners', id);
      await deleteDoc(refDoc);
    } catch (e) {
      console.error('❌ Error al eliminar banner en Firestore:', e);
    }

    const lista = this.banners().filter(b => b.id !== id);
    this.banners.set(lista);
    this.guardarBanners(lista);
    return true;
  }
}


