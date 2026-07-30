import { Routes } from '@angular/router';
import { guardiaAdmin } from './core/guards/guardia-admin.guard';
import { guardiaAutenticacion } from './core/guards/guardia-autenticacion.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./pages/home/pagina-inicio.component').then(m => m.PaginaInicioComponent)
  },
  {
    path: 'catalog',
    loadComponent: () => import('./pages/catalog/pagina-catalogo.component').then(m => m.PaginaCatalogoComponent)
  },
  {
    path: 'product/:id',
    loadComponent: () => import('./pages/product/pagina-detalle-producto.component').then(m => m.PaginaDetalleProductoComponent)
  },
  {
    path: 'unlock',
    loadComponent: () => import('./pages/unlock/pagina-desbloqueo.component').then(m => m.PaginaDesbloqueoComponent)
  },
  {
    path: 'admin/login',
    loadComponent: () => import('./pages/admin/login/pagina-admin-login.component').then(m => m.PaginaAdminLoginComponent),
    canActivate: [guardiaAutenticacion]
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./pages/admin/dashboard/pagina-admin-dashboard.component').then(m => m.PaginaAdminDashboardComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/products',
    loadComponent: () => import('./pages/admin/products/pagina-admin-productos.component').then(m => m.PaginaAdminProductosComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./pages/admin/users/pagina-admin-usuarios.component').then(m => m.PaginaAdminUsuariosComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/banners',
    loadComponent: () => import('./pages/admin/banners/pagina-admin-banners.component').then(m => m.PaginaAdminBannersComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/categories',
    loadComponent: () => import('./pages/admin/categories/pagina-admin-categorias.component').then(m => m.PaginaAdminCategoriasComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/theme',
    loadComponent: () => import('./pages/admin/theme/pagina-admin-tema.component').then(m => m.PaginaAdminTemaComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin/settings',
    loadComponent: () => import('./pages/admin/settings/pagina-admin-configuracion.component').then(m => m.PaginaAdminConfiguracionComponent),
    canActivate: [guardiaAdmin]
  },
  {
    path: 'admin',
    redirectTo: 'admin/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'home'
  }
];
