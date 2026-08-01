import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ServicioAutenticacion } from '../services/auth/servicio-autenticacion.service';

export const guardiaAutenticacion: CanActivateFn = (route, state) => {
  const authService = inject(ServicioAutenticacion);
  const router = inject(Router);

  const sesionLocal = localStorage.getItem('smoke_shop_admin_session');
  if (authService.estaAutenticadoAdmin() || sesionLocal) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
