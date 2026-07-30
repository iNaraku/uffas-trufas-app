import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { Producto } from '../../../core/models/producto.model';
import { PrecioPipe } from '../../pipes/precio.pipe';
import { ServicioPin } from '../../../services/pin/servicio-pin.service';
import { ServicioConfiguracion } from '../../../services/settings/servicio-configuracion.service';

@Component({
  selector: 'app-tarjeta-producto',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule, PrecioPipe],
  templateUrl: './tarjeta-producto.component.html',
  styleUrls: ['./tarjeta-producto.component.css']
})
export class TarjetaProductoComponent {
  @Input({ required: true }) producto!: Producto;
  @Output() solicitarDesbloqueo = new EventEmitter<void>();

  public servicioPin = inject(ServicioPin);
  public servicioConfig = inject(ServicioConfiguracion);

  solicitarAcceso(): void {
    this.solicitarDesbloqueo.emit();
  }

  consultarWhatsapp(e: Event): void {
    e.stopPropagation();
    const tel = this.servicioConfig.configuracion().telefonoWhatsapp.replace(/[^0-9]/g, '');
    const mensaje = encodeURIComponent(`Hola ${this.servicioConfig.configuracion().nombreTienda}, me interesa el producto: ${this.producto.nombre} (${this.producto.precio} MXN).`);
    window.open(`https://wa.me/${tel}?text=${mensaje}`, '_blank');
  }
}
