import { Injectable, signal } from '@angular/core';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs } from 'firebase/firestore';
import { UsuarioCatalogo } from '../../models/usuario-catalogo.model';
import { db } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioUsuariosCatalogo {
  private claveStorage = 'smoke_shop_usuarios_catalogo';

  public listaUsuarios = signal<UsuarioCatalogo[]>([]);

  constructor() {
    this.cargarUsuarios();
  }

  private cargarUsuarios(): void {
    try {
      const refColeccion = collection(db, 'usuarios_catalogo');
      onSnapshot(refColeccion, (snapshot) => {
        const lista: UsuarioCatalogo[] = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as UsuarioCatalogo));
        this.listaUsuarios.set(lista);
        this.guardarEnStorage(lista);
      });
    } catch (e) {
      console.error('❌ Error al escuchar Firestore usuarios_catalogo:', e);
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

    if (!this.listaUsuarios().some(u => u.id === id)) {
      const listaActualizada = [...this.listaUsuarios(), usuarioCreado];
      this.listaUsuarios.set(listaActualizada);
      this.guardarEnStorage(listaActualizada);
    }
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


