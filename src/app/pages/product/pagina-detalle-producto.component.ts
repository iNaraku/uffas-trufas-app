import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EncabezadoComponent } from '../../shared/components/encabezado/encabezado.component';
import { ServicioProductos } from '../../services/products/servicio-productos.service';
import { ServicioPin } from '../../services/pin/servicio-pin.service';
import { ServicioConfiguracion } from '../../services/settings/servicio-configuracion.service';
import { Producto } from '../../models/producto.model';
import { PrecioPipe } from '../../shared/pipes/precio.pipe';

@Component({
  selector: 'app-pagina-detalle-producto',
  standalone: true,
  host: { 'class': 'ion-page' },
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    EncabezadoComponent,
    PrecioPipe
  ],
  templateUrl: './pagina-detalle-producto.component.html',
  styleUrls: ['./pagina-detalle-producto.component.css']
})
export class PaginaDetalleProductoComponent implements OnInit {
  private route = inject(ActivatedRoute);
  public servicioProductos = inject(ServicioProductos);
  public servicioPin = inject(ServicioPin);
  public servicioConfig = inject(ServicioConfiguracion);

  public producto = signal<Producto | null>(null);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const prod = this.servicioProductos.obtenerProductoPorId(id);
      if (prod) {
        this.producto.set(prod);
      }
    }
  }

  consultarWhatsapp(): void {
    const prod = this.producto();
    if (!prod) return;
    const tel = this.servicioConfig.configuracion().telefonoWhatsapp.replace(/[^0-9]/g, '');
    const mensaje = encodeURIComponent(`Hola ${this.servicioConfig.configuracion().nombreTienda}, deseo consultar disponibilidad de: ${prod.nombre} (${prod.precio} MXN).`);
    window.open(`https://wa.me/${tel}?text=${mensaje}`, '_blank');
  }

  abrirPinModal(): void {
    this.servicioPin.abrirModalPin();
  }
}
