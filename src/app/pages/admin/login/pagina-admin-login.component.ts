import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';

@Component({
  selector: 'app-pagina-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
  templateUrl: './pagina-admin-login.component.html',
  styleUrls: ['./pagina-admin-login.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminLoginComponent {
  private servicioAuth = inject(ServicioAutenticacion);
  private router = inject(Router);
  private navCtrl = inject(NavController);
  private ngZone = inject(NgZone);

  public emailInput: string = '';
  public passInput: string = '';
  public cargando: boolean = false;
  public mensajeError: string | null = null;

  async ingresar(): Promise<void> {
    this.mensajeError = null;

    if (!this.emailInput || !this.passInput) {
      this.mensajeError = 'Por favor ingresa tu correo y contraseña.';
      return;
    }

    // Quitar foco del elemento activo para evitar bloqueo de ARIA aria-hidden en Ionic/browser
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }

    this.cargando = true;

    try {
      const exito = await this.servicioAuth.iniciarSesion(this.emailInput, this.passInput);
      if (exito) {
        this.ngZone.run(() => {
          this.navCtrl.navigateRoot('/admin/dashboard', { animationDirection: 'forward' });
        });
      } else {
        this.mensajeError = 'Credenciales inválidas. Verifica tu correo y contraseña.';
      }
    } catch (error: any) {
      console.error('❌ Error capturado en Login Component:', error);
      const codigo = error?.code || '';

      if (codigo === 'auth/invalid-credential' || codigo === 'auth/wrong-password' || codigo === 'auth/user-not-found') {
        this.mensajeError = 'Correo o contraseña incorrectos. Verifica que la cuenta exista en tu proyecto de Firebase Auth.';
      } else if (codigo === 'auth/invalid-email') {
        this.mensajeError = 'Formato de correo electrónico inválido.';
      } else if (codigo === 'auth/too-many-requests') {
        this.mensajeError = 'Demasiados intentos fallidos. Intenta más tarde.';
      } else if (codigo === 'auth/timeout') {
        this.mensajeError = 'La conexión a Firebase Auth superó el tiempo límite. Verifica tu internet o tu consola de Firebase.';
      } else if (codigo === 'auth/operation-not-allowed') {
        this.mensajeError = 'El inicio de sesión con Correo/Contraseña no está habilitado en tu Consola de Firebase -> Authentication.';
      } else {
        this.mensajeError = error?.message || 'Ocurrió un error al iniciar sesión en Firebase Auth.';
      }
    } finally {
      this.cargando = false;
    }
  }
}






