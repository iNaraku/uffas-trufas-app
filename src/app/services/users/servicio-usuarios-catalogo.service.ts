import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { UsuarioCatalogo } from '../../core/models/usuario-catalogo.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuariosCatalogo {
  private claveStorage = 'smoke_shop_usuarios_catalogo';

  public listaUsuarios = signal<UsuarioCatalogo[]>([]);

  private usuariosIniciales: UsuarioCatalogo[] = [
    {
      id: 'usr-1',
      nombre: 'Cliente VIP Premium',
      pin: '1234',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      observaciones: 'Acceso completo al catálogo privado VIP'
    },
    {
      id: 'usr-2',
      nombre: 'Socio Exclusivo Rebel',
      pin: '7777',
      activo: true,
      fechaCreacion: new Date().toISOString(),
      observaciones: 'Miembro del club Rebel Smoke'
    },
    {
      id: 'usr-3',
      nombre: 'Usuario Prueba Inactivo',
      pin: '0000',
      activo: false,
      fechaCreacion: new Date().toISOString(),
      observaciones: 'Cuenta suspendida por mantenimiento'
    }
  ];

  constructor() {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    try {
      const refColeccion = collection(db, 'usuarios_catalogo');
      onSnapshot(refColeccion, (snapshot) => {
        if (!snapshot.empty) {
          const lista: UsuarioCatalogo[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsuarioCatalogo));
          this.listaUsuarios.set(lista);
          this.guardarEnStorage(lista);
        } else {
          this.usuariosIniciales.forEach(u => {
            const refDoc = doc(db, 'usuarios_catalogo', u.id);
            setDoc(refDoc, u);
          });
          this.listaUsuarios.set(this.usuariosIniciales);
        }
      });
      return;
    } catch (e) {
      console.warn('⚠️ Error al escuchar Firestore usuarios_catalogo:', e);
    }

    const datosLocal = localStorage.getItem(this.claveStorage);
    if (datosLocal) {
      try {
        const parsed = JSON.parse(datosLocal);
        this.listaUsuarios.set(parsed);
      } catch (e) {
        this.listaUsuarios.set(this.usuariosIniciales);
        this.guardarEnStorage(this.usuariosIniciales);
      }
    } else {
      this.listaUsuarios.set(this.usuariosIniciales);
      this.guardarEnStorage(this.usuariosIniciales);
    }
  }

  private guardarEnStorage(usuarios: UsuarioCatalogo[]): void {
    localStorage.setItem(this.claveStorage, JSON.stringify(usuarios));
  }

  public async obtenerUsuarios(): Promise<UsuarioCatalogo[]> {
    return this.listaUsuarios();
  }

  public async obtenerUsuarioPorPin(pin: string): Promise<UsuarioCatalogo | null> {
    try {
      const refColeccion = collection(db, 'usuarios_catalogo');
      const q = query(refColeccion, where('pin', '==', pin));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0];
        return { id: docData.id, ...docData.data() } as UsuarioCatalogo;
      }
    } catch (e) {
      console.warn('⚠️ Error consultando PIN en Firestore, usando cache local:', e);
    }

    const usuarios = this.listaUsuarios();
    const encontrado = usuarios.find(u => u.pin === pin);
    return encontrado || null;
  }

  public async crearUsuario(nuevoUsuario: Omit<UsuarioCatalogo, 'id' | 'fechaCreacion'>): Promise<UsuarioCatalogo> {
    const id = 'usr-' + Date.now();
    const usuarioCreado: UsuarioCatalogo = {
      ...nuevoUsuario,
      id,
      fechaCreacion: new Date().toISOString()
    };

    try {
      const refDoc = doc(db, 'usuarios_catalogo', id);
      await setDoc(refDoc, usuarioCreado);
    } catch (e) {
      console.error('❌ Error al crear usuario en Firestore:', e);
    }

    const listaActualizada = [...this.listaUsuarios(), usuarioCreado];
    this.listaUsuarios.set(listaActualizada);
    this.guardarEnStorage(listaActualizada);
    return usuarioCreado;
  }

  public async actualizarUsuario(id: string, datos: Partial<UsuarioCatalogo>): Promise<boolean> {
    try {
      const refDoc = doc(db, 'usuarios_catalogo', id);
      await updateDoc(refDoc, datos);
    } catch (e) {
      console.error('❌ Error al actualizar usuario en Firestore:', e);
    }

    const listaActualizada = this.listaUsuarios().map(u => {
      if (u.id === id) {
        return { ...u, ...datos };
      }
      return u;
    });
    this.listaUsuarios.set(listaActualizada);
    this.guardarEnStorage(listaActualizada);
    return true;
  }

  public async eliminarUsuario(id: string): Promise<boolean> {
    try {
      const refDoc = doc(db, 'usuarios_catalogo', id);
      await deleteDoc(refDoc);
    } catch (e) {
      console.error('❌ Error al eliminar usuario en Firestore:', e);
    }

    const listaActualizada = this.listaUsuarios().filter(u => u.id !== id);
    this.listaUsuarios.set(listaActualizada);
    this.guardarEnStorage(listaActualizada);
    return true;
  }

  public async cambiarEstado(id: string, activo: boolean): Promise<boolean> {
    return this.actualizarUsuario(id, { activo });
  }

  public async cambiarPin(id: string, nuevoPin: string): Promise<boolean> {
    return this.actualizarUsuario(id, { pin: nuevoPin });
  }
}


