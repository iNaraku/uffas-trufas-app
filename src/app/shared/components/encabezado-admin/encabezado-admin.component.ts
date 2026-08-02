import { Component, inject, NgZone, Input, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { NavController } from '@ionic/angular/standalone';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import {
  gridOutline,
  cubeOutline,
  peopleOutline,
  imagesOutline,
  pricetagsOutline,
  colorPaletteOutline,
  settingsOutline,
  openOutline,
  shieldCheckmark,
  logOutOutline,
  menuOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-encabezado-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './encabezado-admin.component.html',
  styleUrls: ['./encabezado-admin.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EncabezadoAdminComponent {
  @Input() rutaActiva: string = '';

  public servicioAuth = inject(ServicioAutenticacion);
  public router = inject(Router);
  private navCtrl = inject(NavController);
  private ngZone = inject(NgZone);

  public icons = {
    gridOutline,
    cubeOutline,
    peopleOutline,
    imagesOutline,
    pricetagsOutline,
    colorPaletteOutline,
    settingsOutline,
    openOutline,
    shieldCheckmark,
    logOutOutline,
    menuOutline
  };

  irA(ruta: string, e?: Event): void {
    if (e) e.preventDefault();
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot(ruta, { animated: false });
    });
  }

  async salirAdmin(): Promise<void> {
    if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    await this.servicioAuth.cerrarSesion();
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot('/admin/login', { animated: false });
    });
  }
}
