import { Component, inject, NgZone, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';

@Component({
  selector: 'app-encabezado-admin',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './encabezado-admin.component.html',
  styleUrls: ['./encabezado-admin.component.css']
})
export class EncabezadoAdminComponent {
  @Input() rutaActiva: string = '';

  public servicioAuth = inject(ServicioAutenticacion);
  public router = inject(Router);
  private navCtrl = inject(NavController);
  private ngZone = inject(NgZone);

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
