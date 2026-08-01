import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Banner } from '../../models/banner.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioBanners {
  private claveStorageBanners = 'smoke_shop_banners';

  public banners = signal<Banner[]>([]);

  constructor() {
    this.cargarBanners();
  }

  private cargarBanners(): void {
    try {
      const refColeccion = collection(db, 'banners');
      onSnapshot(refColeccion, (snapshot) => {
        const lista: Banner[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Banner));
        this.banners.set(lista);
        this.guardarBanners(lista);
      });
    } catch (e) {
      console.error('❌ Error al escuchar Firestore banners:', e);
    }
  }

  private guardarBanners(list: Banner[]): void {
    localStorage.setItem(this.claveStorageBanners, JSON.stringify(list));
  }

  public obtenerBannersActivos(): Banner[] {
    return this.banners()
      .filter(b => b.activo !== false)
      .sort((a, b) => (a.orden || 0) - (b.orden || 0));
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



