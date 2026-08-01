import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { Producto, VisibilidadProducto, EstadoProducto } from '../../core/models/producto.model';
import { Categoria } from '../../core/models/categoria.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioProductos {
  private claveStorageProductos = 'smoke_shop_productos';
  private claveStorageCategorias = 'smoke_shop_categorias';

  public productos = signal<Producto[]>([]);
  public categorias = signal<Categoria[]>([]);

  private categoriasIniciales: Categoria[] = [
    { id: 'cat-1', nombre: 'Encendedores & Sopladores', orden: 1, activa: true, descripcion: 'Encendedores Zippo, Clipper, sopletes de precisión' },
    { id: 'cat-2', nombre: 'Papeles & Filtros', orden: 2, activa: true, descripcion: 'Papel Raw, OCB, orgánicos, sábanas y celulosa' },
    { id: 'cat-3', nombre: 'Grinders & Moledores', orden: 3, activa: true, descripcion: 'Moledores de 2, 4 piezas, aluminio anodizado y titanio' },
    { id: 'cat-4', nombre: 'Bongs & Pipas Premium 🔒', orden: 4, activa: true, descripcion: 'Piezas exclusivas de borosilicato y cristalería de colección' },
    { id: 'cat-5', nombre: 'Extractos & Dab Rigs 🔒', orden: 5, activa: true, descripcion: 'Accesorios para concentrados, bangers de cuarzo y rigs VIP' },
    { id: 'cat-6', nombre: 'Accesorios Exclusivos 🔒', orden: 6, activa: true, descripcion: 'Ediciones limitadas Rebel Wings, estuches anti-olor' }
  ];

  private productosIniciales: Producto[] = [
    // PÚBLICOS
    {
      id: 'prod-1',
      nombre: 'Encendedor Zippo Matte Black Rebel',
      descripcion: 'Encendedor a prueba de viento con acabado negro mate y grabado láser oficial Rebel.',
      categoriaId: 'cat-1',
      categoriaNombre: 'Encendedores & Sopladores',
      precio: 650,
      imagenUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: true,
      orden: 1,
      visibilidad: 'PUBLIC',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-2',
      nombre: 'Papel RAW Organic Hemp King Size',
      descripcion: 'Caja con 50 paquetes de papel cáñamo 100% orgánico sin blanquear.',
      categoriaId: 'cat-2',
      categoriaNombre: 'Papeles & Filtros',
      precio: 180,
      imagenUrl: 'https://images.unsplash.com/photo-1603909223429-69bb7101f420?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: false,
      orden: 2,
      visibilidad: 'PUBLIC',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-3',
      nombre: 'Grinder Heavy Metal 4 Piezas 63mm',
      descripcion: 'Moledor de aluminio grado aerospacial con tamiz de polen ultra fino y espátula.',
      categoriaId: 'cat-3',
      categoriaNombre: 'Grinders & Moledores',
      precio: 490,
      imagenUrl: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: true,
      orden: 3,
      visibilidad: 'PUBLIC',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-4',
      nombre: 'Bandeja de Metal XL Rebel Wings Custom',
      descripcion: 'Bandeja ergonómica para rolar con bordes elevados y diseño exclusivo Harley/Rebel.',
      categoriaId: 'cat-6',
      categoriaNombre: 'Accesorios Exclusivos',
      precio: 320,
      imagenUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: false,
      orden: 4,
      visibilidad: 'PUBLIC',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    // PRIVADOS 🔒
    {
      id: 'prod-5',
      nombre: 'Bong Borosilicato Matrix Percolator 45cm 🔒',
      descripcion: 'Bong de agua de doble filtración por percolador matrix, cristal de 7mm resistente a impacto térmico.',
      categoriaId: 'cat-4',
      categoriaNombre: 'Bongs & Pipas Premium 🔒',
      precio: 2850,
      imagenUrl: 'https://images.unsplash.com/photo-1527016021513-b09758b777bd?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: true,
      orden: 5,
      visibilidad: 'PRIVATE',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-6',
      nombre: 'Dab Rig Gold Edition Quartz Banger 🔒',
      descripcion: 'Rig exclusivo para concentrados con detalles bañados en pan de oro de 24K y banger de cuarzo grado médico.',
      categoriaId: 'cat-5',
      categoriaNombre: 'Extractos & Dab Rigs 🔒',
      precio: 4200,
      imagenUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: true,
      orden: 6,
      visibilidad: 'PRIVATE',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-7',
      nombre: 'Vaporizador Conducción VIP Pro Titanium 🔒',
      descripcion: 'Vaporizador portátil de temperatura regulable pantalla OLED con cámara de calentamiento de titanio.',
      categoriaId: 'cat-6',
      categoriaNombre: 'Accesorios Exclusivos 🔒',
      precio: 3600,
      imagenUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: true,
      orden: 7,
      visibilidad: 'PRIVATE',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    },
    {
      id: 'prod-8',
      nombre: 'Set de Colección Rebel Wings Smoke Chest 🔒',
      descripcion: 'Cofre táctico de aluminio reforzado con cerrojo de combinación, incluye Bong mini, Grinder titanio y estuche antiolor.',
      categoriaId: 'cat-6',
      categoriaNombre: 'Accesorios Exclusivos 🔒',
      precio: 5900,
      imagenUrl: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80',
      disponible: true,
      destacado: true,
      orden: 8,
      visibilidad: 'PRIVATE',
      estado: 'ACTIVE',
      fechaCreacion: new Date().toISOString(),
      fechaActualizacion: new Date().toISOString()
    }
  ];

  constructor() {
    this.cargarDatos();
  }

  private cargarDatos(): void {
    try {
      // Escuchar Categorías en Firestore
      const refCats = collection(db, 'categorias');
      onSnapshot(refCats, (snapshot) => {
        if (!snapshot.empty) {
          const listaCats = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Categoria));
          this.categorias.set(listaCats);
          this.guardarCategorias(listaCats);
        } else {
          this.categoriasIniciales.forEach(c => {
            const refDoc = doc(db, 'categorias', c.id);
            setDoc(refDoc, c);
          });
          this.categorias.set(this.categoriasIniciales);
        }
      });

      // Escuchar Productos en Firestore
      const refProds = collection(db, 'productos');
      onSnapshot(refProds, (snapshot) => {
        if (!snapshot.empty) {
          const listaProds = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Producto));
          this.productos.set(listaProds);
          this.guardarProductos(listaProds);
        } else {
          this.productosIniciales.forEach(p => {
            const refDoc = doc(db, 'productos', p.id);
            setDoc(refDoc, p);
          });
          this.productos.set(this.productosIniciales);
        }
      });
      return;
    } catch (e) {
      console.warn('⚠️ Error al escuchar Firestore productos/categorias:', e);
    }

    // Fallback Local Storage
    const localCat = localStorage.getItem(this.claveStorageCategorias);
    if (localCat) {
      try {
        this.categorias.set(JSON.parse(localCat));
      } catch (e) {
        this.categorias.set(this.categoriasIniciales);
        this.guardarCategorias(this.categoriasIniciales);
      }
    } else {
      this.categorias.set(this.categoriasIniciales);
      this.guardarCategorias(this.categoriasIniciales);
    }

    const localProd = localStorage.getItem(this.claveStorageProductos);
    if (localProd) {
      try {
        this.productos.set(JSON.parse(localProd));
      } catch (e) {
        this.productos.set(this.productosIniciales);
        this.guardarProductos(this.productosIniciales);
      }
    } else {
      this.productos.set(this.productosIniciales);
      this.guardarProductos(this.productosIniciales);
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


