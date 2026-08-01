import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Producto, VisibilidadProducto, EstadoProducto } from '../../models/producto.model';
import { Categoria } from '../../models/categoria.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioProductos {
  private claveStorageProductos = 'smoke_shop_productos';
  private claveStorageCategorias = 'smoke_shop_categorias';

  public productos = signal<Producto[]>([]);
  public categorias = signal<Categoria[]>([]);

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    try {
      // Escuchar Categorías en Firestore
      const refCats = collection(db, 'categorias');
      onSnapshot(refCats, (snapshot) => {
        const listaCats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Categoria));
        this.categorias.set(listaCats);
        this.guardarCategorias(listaCats);
      });

      // Escuchar Productos en Firestore
      const refProds = collection(db, 'productos');
      onSnapshot(refProds, (snapshot) => {
        const listaProds = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Producto));
        this.productos.set(listaProds);
        this.guardarProductos(listaProds);
      });
    } catch (e) {
      console.error('❌ Error escuchando Firestore productos/categorias:', e);
    }
  }



  private guardarProductos(prods: Producto[]): void {
    localStorage.setItem(this.claveStorageProductos, JSON.stringify(prods));
  }

  private guardarCategorias(cats: Categoria[]): void {
    localStorage.setItem(this.claveStorageCategorias, JSON.stringify(cats));
  }

  // MÉTODOS DE PRODUCTO

  public obtenerProductosPublicos(): Producto[] {
    return this.productos()
      .filter(p => p.visibilidad === 'PUBLIC' && p.estado === 'ACTIVE')
      .sort((a, b) => a.orden - b.orden);
  }

  public obtenerProductosTodos(): Producto[] {
    return this.productos()
      .filter(p => p.estado === 'ACTIVE')
      .sort((a, b) => a.orden - b.orden);
  }

  public obtenerProductoPorId(id: string): Producto | undefined {
    return this.productos().find(p => p.id === id);
  }

  public async crearProducto(nuevo: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'>): Promise<Producto> {
    const cat = this.categorias().find(c => c.id === nuevo.categoriaId);
    const id = 'prod-' + Date.now();
    const prod: Producto = {
      ...nuevo,
      id,
      categoriaNombre: cat ? cat.nombre : '',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    };

    try {
      const refDoc = doc(db, 'productos', id);
      await setDoc(refDoc, prod);
    } catch (e) {
      console.error('❌ Error al crear producto en Firestore:', e);
    }

    const lista = [...this.productos(), prod];
    this.productos.set(lista);
    this.guardarProductos(lista);
    return prod;
  }

  public async actualizarProducto(id: string, datos: Partial<Producto>): Promise<boolean> {
    const cat = datos.categoriaId ? this.categorias().find(c => c.id === datos.categoriaId) : null;
    const camposActualizar = {
      ...datos,
      ...(cat ? { categoriaNombre: cat.nombre } : {}),
      fechaActualizacion: new Date().toISOString()
    };

    try {
      const refDoc = doc(db, 'productos', id);
      await updateDoc(refDoc, camposActualizar);
    } catch (e) {
      console.error('❌ Error al actualizar producto en Firestore:', e);
    }

    const lista = this.productos().map(p => {
      if (p.id === id) {
        return { ...p, ...camposActualizar };
      }
      return p;
    });
    this.productos.set(lista);
    this.guardarProductos(lista);
    return true;
  }

  public async eliminarProducto(id: string): Promise<boolean> {
    try {
      const refDoc = doc(db, 'productos', id);
      await deleteDoc(refDoc);
    } catch (e) {
      console.error('❌ Error al eliminar producto en Firestore:', e);
    }

    const lista = this.productos().filter(p => p.id !== id);
    this.productos.set(lista);
    this.guardarProductos(lista);
    return true;
  }

  public async duplicarProducto(id: string): Promise<Producto | null> {
    const original = this.obtenerProductoPorId(id);
    if (!original) return null;

    const copia: Omit<Producto, 'id' | 'fechaCreacion' | 'fechaActualizacion'> = {
      ...original,
      nombre: `${original.nombre} (Copia)`,
      orden: original.orden + 1
    };

    return await this.crearProducto(copia);
  }

  public async cambiarVisibilidad(id: string, visibilidad: VisibilidadProducto): Promise<boolean> {
    return this.actualizarProducto(id, { visibilidad });
  }

  public async cambiarEstado(id: string, estado: EstadoProducto): Promise<boolean> {
    return this.actualizarProducto(id, { estado });
  }

  // MÉTODOS DE CATEGORÍA

  public async crearCategoria(cat: Omit<Categoria, 'id'>): Promise<Categoria> {
    const id = 'cat-' + Date.now();
    const nueva: Categoria = { ...cat, id };

    try {
      const refDoc = doc(db, 'categorias', id);
      await setDoc(refDoc, nueva);
    } catch (e) {
      console.error('❌ Error al crear categoría en Firestore:', e);
    }

    const lista = [...this.categorias(), nueva];
    this.categorias.set(lista);
    this.guardarCategorias(lista);
    return nueva;
  }

  public async actualizarCategoria(id: string, datos: Partial<Categoria>): Promise<boolean> {
    try {
      const refDoc = doc(db, 'categorias', id);
      await updateDoc(refDoc, datos);
    } catch (e) {
      console.error('❌ Error al actualizar categoría en Firestore:', e);
    }

    const lista = this.categorias().map(c => c.id === id ? { ...c, ...datos } : c);
    this.categorias.set(lista);
    this.guardarCategorias(lista);
    return true;
  }

  public async eliminarCategoria(id: string): Promise<boolean> {
    try {
      const refDoc = doc(db, 'categorias', id);
      await deleteDoc(refDoc);
    } catch (e) {
      console.error('❌ Error al eliminar categoría en Firestore:', e);
    }

    const lista = this.categorias().filter(c => c.id !== id);
    this.categorias.set(lista);
    this.guardarCategorias(lista);
    return true;
  }
}


