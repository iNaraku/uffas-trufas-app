import { Injectable, signal, inject } from '@angular/core';
import { ModalController, ToastController } from '@ionic/angular/standalone';
import { UsuarioCatalogo } from '../../models/usuario-catalogo.model';
import { ServicioUsuariosCatalogo } from '../users/servicio-usuarios-catalogo.service';
import { ModalPinComponent } from '../../shared/components/modal-pin/modal-pin.component';

@Injectable({
  providedIn: 'root'
})
export class ServicioPin {
  private servicioUsuarios = inject(ServicioUsuariosCatalogo);
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  public estaDesbloqueado = signal<boolean>(false);
  public usuarioCatalogoActual = signal<UsuarioCatalogo | null>(null);
  public mensajeError = signal<string | null>(null);

  constructor() {
    this.recuperarSesionPin();
  }

  public async abrirModalPin(): Promise<boolean> {
    const isMobile = window.innerWidth <= 768;
    const modalOptions: any = {
      component: ModalPinComponent,
      cssClass: 'modal-pin-native-sheet',
      backdropDismiss: true
    };

    if (isMobile) {
      modalOptions.breakpoints = [0, 0.85, 1];
      modalOptions.initialBreakpoint = 0.85;
      modalOptions.handle = true;
    }

    const modal = await this.modalCtrl.create(modalOptions);
    await modal.present();
    const { data } = await modal.onWillDismiss();
    return !!data?.exito;
  }

  private async mostrarToast(mensaje: string, color: 'success' | 'danger' | 'warning' = 'success'): Promise<void> {
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
