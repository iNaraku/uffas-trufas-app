import { Injectable, signal, computed, inject } from '@angular/core';
import { UsuarioCatalogo } from '../../models/usuario-catalogo.model';
import { ServicioUsuariosCatalogo } from '../users/servicio-usuarios-catalogo.service';

@Injectable({
  providedIn: 'root'
})
export class ServicioPin {
  private servicioUsuarios = inject(ServicioUsuariosCatalogo);

  public estaDesbloqueado = signal<boolean>(false);
  public usuarioCatalogoActual = signal<UsuarioCatalogo | null>(null);
  public mensajeError = signal<string | null>(null);

  constructor() {
    this.recuperarSesionPin();
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
      return true;
    } else {
      this.mensajeError.set('PIN incorrecto o usuario inactivado. Contacta al administrador.');
      return false;
    }
  }

  public bloquearCatalogo(): void {
    this.estaDesbloqueado.set(false);
    this.usuarioCatalogoActual.set(null);
    this.mensajeError.set(null);
    sessionStorage.removeItem('smoke_shop_pin_usuario');
  }
}
