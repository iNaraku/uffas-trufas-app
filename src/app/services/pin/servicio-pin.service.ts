import { Injectable, signal, inject } from '@angular/core';
import { ToastController, ModalController } from '@ionic/angular/standalone';
import { UsuarioCatalogo } from '../../models/usuario-catalogo.model';
import { ServicioUsuariosCatalogo } from '../users/servicio-usuarios-catalogo.service';
import { ModalPinComponent } from '../../shared/components/modal-pin/modal-pin.component';

@Injectable({
  providedIn: 'root'
})
export class ServicioPin {
  private servicioUsuarios = inject(ServicioUsuariosCatalogo);
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);

  public estaDesbloqueado = signal<boolean>(false);
  public usuarioCatalogoActual = signal<UsuarioCatalogo | null>(null);
  public mensajeError = signal<string | null>(null);

  constructor() {
    this.recuperarSesionPin();
  }

  public async abrirModalPin(): Promise<boolean> {
    this.mensajeError.set(null);
    try {
      const modal = await this.modalCtrl.create({
        component: ModalPinComponent,
        backdropDismiss: true,
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      return !!data?.exito;
    } catch (e) {
      console.error('Error al abrir ModalController:', e);
      return false;
    }
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
    try {
      const toast = await this.toastCtrl.create({
        message: mensaje,
        duration: 3000,
        color: color,
        position: 'bottom',
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          }
        ]
      });
      await toast.present();
    } catch (e) {
      console.warn('Toast notification:', e);
    }
  }

  private recuperarSesionPin(): void {
    const sesionGuardada = sessionStorage.getItem('smoke_shop_pin_usuario');
    if (sesionGuardada) {
      try {
        const usuario: UsuarioCatalogo = JSON.parse(sesionGuardada);
        if (usuario && usuario.activo) {
          this.estaDesbloqueado.set(true);
          this.usuarioCatalogoActual.set(usuario);
        } else {
          this.bloquearCatalogo();
        }
      } catch (e) {
        this.bloquearCatalogo();
      }
    }
  }

  public async validarPin(pinIngresado: string): Promise<boolean> {
    this.mensajeError.set(null);
    if (!pinIngresado || pinIngresado.trim().length === 0) {
      this.mensajeError.set('Por favor ingresa un PIN válido.');
      return false;
    }

    const usuarioValido = await this.servicioUsuarios.obtenerUsuarioPorPin(pinIngresado.trim());
    if (usuarioValido && usuarioValido.activo) {
      this.estaDesbloqueado.set(true);
      this.usuarioCatalogoActual.set(usuarioValido);
      sessionStorage.setItem('smoke_shop_pin_usuario', JSON.stringify(usuarioValido));
      this.mostrarToast(`¡Bienvenido ${usuarioValido.nombre}! Catálogo Privado Desbloqueado 🔓`, 'success');
      return true;
    } else {
      this.mensajeError.set('PIN incorrecto o usuario inactivado.');
      this.mostrarToast('PIN incorrecto o no autorizado 🔒', 'danger');
      return false;
    }
  }

  public async bloquearCatalogo(): Promise<void> {
    this.estaDesbloqueado.set(false);
    this.usuarioCatalogoActual.set(null);
    this.mensajeError.set(null);
    sessionStorage.removeItem('smoke_shop_pin_usuario');
    this.mostrarToast('Catálogo Privado Bloqueado 🔒', 'warning');
  }
}
