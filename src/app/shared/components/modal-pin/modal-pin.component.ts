import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon, IonContent, IonSpinner } from '@ionic/angular/standalone';
import { ServicioPin } from '../../../services/pin/servicio-pin.service';
import { ModalController } from '@ionic/angular/standalone';

@Component({
  selector: 'app-modal-pin',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonButtons, 
    IonButton, 
    IonIcon, 
    IonContent, 
    IonSpinner
  ],
  templateUrl: './modal-pin.component.html',
  styleUrls: ['./modal-pin.component.css']
})
export class ModalPinComponent {
  public servicioPin = inject(ServicioPin);
  private modalCtrl = inject(ModalController);

  public pinIngresado: string = '';
  public cargando: boolean = false;

  async validar(): Promise<void> {
    if (!this.pinIngresado || this.pinIngresado.trim().length === 0) return;

    this.cargando = true;
    const exito = await this.servicioPin.validarPin(this.pinIngresado);
    this.cargando = false;

    if (exito) {
      this.cerrar(true);
    }
  }

  cerrar(exito: boolean = false): void {
    this.modalCtrl.dismiss({ exito });
  }
}
