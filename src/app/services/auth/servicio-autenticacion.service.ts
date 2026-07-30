import { Injectable, signal } from '@angular/core';
import { Administrador } from '../../core/models/administrador.model';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private claveSesionAdmin = 'smoke_shop_admin_session';

  public estaAutenticadoAdmin = signal<boolean>(false);
  public administradorActual = signal<Administrador | null>(null);

  constructor() {
    this.recuperarSesion();
  }

  private recuperarSesion(): void {
    const sesion = localStorage.getItem(this.claveSesionAdmin);
    if (sesion) {
      try {
        const admin: Administrador = JSON.parse(sesion);
        this.administradorActual.set(admin);
        this.estaAutenticadoAdmin.set(true);
      } catch (e) {
        this.cerrarSesion();
      }
    }
  }

  public async iniciarSesion(email: string, pass: string): Promise<boolean> {
    // Validación de administrador por defecto (o Firebase Auth)
    if ((email.trim().toLowerCase() === 'admin@smokeshop.com' || email.trim().toLowerCase() === 'admin') && pass === 'admin123') {
      const admin: Administrador = {
        uid: 'admin-master-1',
        email: email.trim(),
        nombre: 'Administrador Rebel Smoke',
        rol: 'ADMIN',
        fechaUltimoAcceso: new Date().toISOString()
      };
      this.administradorActual.set(admin);
      this.estaAutenticadoAdmin.set(true);
      localStorage.setItem(this.claveSesionAdmin, JSON.stringify(admin));
      return true;
    }
    
    // Si se pasa cualquier otro admin con contraseña demo válida
    if (email.includes('@') && pass.length >= 6) {
      const admin: Administrador = {
        uid: 'admin-' + Date.now(),
        email: email.trim(),
        nombre: 'Administrador Autorizado',
        rol: 'ADMIN',
        fechaUltimoAcceso: new Date().toISOString()
      };
      this.administradorActual.set(admin);
      this.estaAutenticadoAdmin.set(true);
      localStorage.setItem(this.claveSesionAdmin, JSON.stringify(admin));
      return true;
    }

    return false;
  }

  public async cerrarSesion(): Promise<void> {
    this.administradorActual.set(null);
    this.estaAutenticadoAdmin.set(false);
    localStorage.removeItem(this.claveSesionAdmin);
  }
}
