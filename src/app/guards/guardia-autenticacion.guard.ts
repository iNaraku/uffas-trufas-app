import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { ServicioAutenticacion } from '../services/auth/servicio-autenticacion.service';

export const guardiaAutenticacion: CanActivateFn = (route, state) => {
  const authService = inject(ServicioAutenticacion);
  const router = inject(Router);

  if (authService.estaAutenticadoAdmin()) {
    return router.createUrlTree(['/admin/dashboard']);
  }

  return true;
};
