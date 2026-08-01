import { Component, inject, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { ServicioProductos } from '../../../services/products/servicio-productos.service';
import { ServicioUsuariosCatalogo } from '../../../services/users/servicio-usuarios-catalogo.service';
import { ServicioBanners } from '../../../services/banners/servicio-banners.service';
import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

import {
  cubeOutline,
  keyOutline,
  pricetagsOutline,
  imagesOutline,
  addCircleOutline,
  personAddOutline,
  colorPaletteOutline,
  imageOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-pagina-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-dashboard.component.html',
  styleUrls: ['./pagina-admin-dashboard.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminDashboardComponent {
  public servicioAuth = inject(ServicioAutenticacion);
  public servicioProductos = inject(ServicioProductos);
  public servicioUsuarios = inject(ServicioUsuariosCatalogo);
  public servicioBanners = inject(ServicioBanners);
  private router = inject(Router);
  private navCtrl = inject(NavController);
  private ngZone = inject(NgZone);

  public icons = {
    cubeOutline,
    keyOutline,
    pricetagsOutline,
    imagesOutline,
    addCircleOutline,
    personAddOutline,
    colorPaletteOutline,
    imageOutline
  };

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
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot('/admin/login', { animationDirection: 'back' });
    });
  }
}
