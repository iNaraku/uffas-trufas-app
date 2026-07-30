import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioPin } from '../../../services/pin/servicio-pin.service';
import { ServicioTema } from '../../../services/theme/servicio-tema.service';
import { ServicioConfiguracion } from '../../../services/settings/servicio-configuracion.service';
import { ModalPinComponent } from '../modal-pin/modal-pin.component';

@Component({
  selector: 'app-encabezado',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, ModalPinComponent],
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent {
  public servicioPin = inject(ServicioPin);
  public servicioTema = inject(ServicioTema);
  public servicioConfig = inject(ServicioConfiguracion);

  public mostrarModalPin = false;

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
