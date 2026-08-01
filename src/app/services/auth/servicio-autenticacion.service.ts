import { Injectable, inject, NgZone, signal } from '@angular/core';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { Administrador } from '../../models/administrador.model';
import { auth } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioAutenticacion {
  private claveSesionAdmin = 'smoke_shop_admin_session';
  private ngZone = inject(NgZone);

  public estaAutenticadoAdmin = signal<boolean>(false);
  public administradorActual = signal<Administrador | null>(null);

  constructor() {
    this.escucharEstadoAutenticacion();
  }

  private escucharEstadoAutenticacion(): void {
    onAuthStateChanged(auth, (user: User | null) => {
      this.ngZone.run(() => {
        if (user) {
          const admin: Administrador = {
            uid: user.uid,
            email: user.email || '',
            nombre: user.displayName || user.email?.split('@')[0] || 'Administrador',
            rol: 'ADMIN',
            fechaUltimoAcceso: new Date().toISOString()
          };
          this.administradorActual.set(admin);
          this.estaAutenticadoAdmin.set(true);
          localStorage.setItem(this.claveSesionAdmin, JSON.stringify(admin));
        } else {
          this.administradorActual.set(null);
          this.estaAutenticadoAdmin.set(false);
          localStorage.removeItem(this.claveSesionAdmin);
        }
      });
    });
  }

  private conTimeout<T>(promesa: Promise<T>, ms: number = 10000): Promise<T> {
    return Promise.race([
      promesa,
      new Promise<T>((_, reject) =>
        setTimeout(() => reject({ code: 'auth/timeout', message: 'La solicitud a Firebase Auth superó el tiempo de espera. Verifica tu conexión a internet.' }), ms)
      )
    ]);
  }

  public async iniciarSesion(email: string, pass: string): Promise<boolean> {
    const emailLimpio = email.trim().toLowerCase();

    try {
      const credencial = await this.conTimeout(signInWithEmailAndPassword(auth, emailLimpio, pass));
      const user = credencial.user;

      this.ngZone.run(() => {
        const admin: Administrador = {
          uid: user.uid,
          email: user.email || emailLimpio,
          nombre: user.displayName || user.email?.split('@')[0] || 'Administrador',
          rol: 'ADMIN',
          fechaUltimoAcceso: new Date().toISOString()
        };
        this.administradorActual.set(admin);
        this.estaAutenticadoAdmin.set(true);
        localStorage.setItem(this.claveSesionAdmin, JSON.stringify(admin));
      });
      return true;
    } catch (error) {
      console.error('❌ Error al iniciar sesión en Firebase Auth:', error);
      throw error;
    }
  }

  public async cerrarSesion(): Promise<void> {
    try {
      await this.conTimeout(signOut(auth), 5000);
    } catch (error) {
      console.error('❌ Error al cerrar sesión en Firebase Auth:', error);
    } finally {
      this.ngZone.run(() => {
        this.administradorActual.set(null);
        this.estaAutenticadoAdmin.set(false);
        localStorage.removeItem(this.claveSesionAdmin);
      });
    }
  }
}






