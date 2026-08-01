import { Component, inject, NgZone, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { IonicModule, NavController } from '@ionic/angular';
import { ServicioPin } from '../../../services/pin/servicio-pin.service';
import { ServicioTema } from '../../../services/theme/servicio-tema.service';
import { ServicioConfiguracion } from '../../../services/settings/servicio-configuracion.service';
import { ModalPinComponent } from '../modal-pin/modal-pin.component';

import {
  flame,
  lockClosedOutline,
  lockOpenOutline,
  powerOutline,
  shieldCheckmarkOutline,
  homeOutline,
  cubeOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, ModalPinComponent],
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EncabezadoComponent {
  public servicioPin = inject(ServicioPin);
  public servicioTema = inject(ServicioTema);
  public servicioConfig = inject(ServicioConfiguracion);
  public router = inject(Router);
  private navCtrl = inject(NavController);
  private ngZone = inject(NgZone);

  public mostrarModalPin = false;

  public icons = {
    flame,
    lockClosedOutline,
    lockOpenOutline,
    powerOutline,
    shieldCheckmarkOutline,
    homeOutline,
    cubeOutline
  };

  irAHome(e?: Event): void {
    if (e) e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot('/home', { animated: true, animationDirection: 'back' });
    });
  }

  irACatalogo(e?: Event): void {
    if (e) e.preventDefault();
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.ngZone.run(() => {
      this.navCtrl.navigateRoot('/catalog', { animated: true, animationDirection: 'forward' });
    });
  }

  abrirModalPin(): void {
    this.mostrarModalPin = true;
  }

  cerrarModalPin(): void {
    this.mostrarModalPin = false;
  }

  bloquear(): void {
    this.servicioPin.bloquearCatalogo();
  }
}
