import { Injectable, signal } from '@angular/core';
import { UsuarioCatalogo } from '../../core/models/usuario-catalogo.model';

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
    const usuarios = this.listaUsuarios();
    const encontrado = usuarios.find(u => u.pin === pin);
    return encontrado || null;
  }

  public async crearUsuario(nuevoUsuario: Omit<UsuarioCatalogo, 'id' | 'fechaCreacion'>): Promise<UsuarioCatalogo> {
    const usuarioCreado: UsuarioCatalogo = {
      ...nuevoUsuario,
      id: 'usr-' + Date.now(),
      fechaCreacion: new Date().toISOString()
    };
    const listaActualizada = [...this.listaUsuarios(), usuarioCreado];
    this.listaUsuarios.set(listaActualizada);
    this.guardarEnStorage(listaActualizada);
    return usuarioCreado;
  }

  public async actualizarUsuario(id: string, datos: Partial<UsuarioCatalogo>): Promise<boolean> {
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
