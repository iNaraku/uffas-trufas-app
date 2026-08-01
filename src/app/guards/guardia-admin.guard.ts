import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ServicioAutenticacion } from '../services/auth/servicio-autenticacion.service';

export const guardiaAdmin: CanActivateFn = (route, state) => {
  const authService = inject(ServicioAutenticacion);
  const router = inject(Router);

  if (authService.estaAutenticadoAdmin()) {
    return true;
  }

  const sesionLocal = localStorage.getItem('smoke_shop_admin_session');
  if (sesionLocal) {
    try {
      const admin = JSON.parse(sesionLocal);
      authService.administradorActual.set(admin);
      authService.estaAutenticadoAdmin.set(true);
      return true;
    } catch (e) { }
  }

  return router.createUrlTree(['/admin/login']);
};
