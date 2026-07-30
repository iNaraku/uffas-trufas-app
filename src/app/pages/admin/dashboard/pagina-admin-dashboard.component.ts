import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { ServicioProductos } from '../../../services/products/servicio-productos.service';
import { ServicioUsuariosCatalogo } from '../../../services/users/servicio-usuarios-catalogo.service';
import { ServicioBanners } from '../../../services/banners/servicio-banners.service';

@Component({
  selector: 'app-pagina-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './pagina-admin-dashboard.component.html',
  styleUrls: ['./pagina-admin-dashboard.component.css']
})
export class PaginaAdminDashboardComponent {
  public servicioAuth = inject(ServicioAutenticacion);
  public servicioProductos = inject(ServicioProductos);
  public servicioUsuarios = inject(ServicioUsuariosCatalogo);
  public servicioBanners = inject(ServicioBanners);
  private router = inject(Router);

  get totalProductos(): number {
    return this.servicioProductos.productos().length;
  }

  get productosPublicos(): number {
    return this.servicioProductos.productos().filter(p => p.visibilidad === 'PUBLIC').length;
  }

  get productosPrivados(): number {
    return this.servicioProductos.productos().filter(p => p.visibilidad === 'PRIVATE').length;
  }

  get usuariosActivos(): number {
    return this.servicioUsuarios.listaUsuarios().filter(u => u.activo).length;
  }

  get totalBanners(): number {
    return this.servicioBanners.banners().length;
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
