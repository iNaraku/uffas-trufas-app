import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EncabezadoComponent } from '../../shared/components/encabezado/encabezado.component';
import { PiePaginaComponent } from '../../shared/components/pie-pagina/pie-pagina.component';
import { TarjetaProductoComponent } from '../../shared/components/tarjeta-producto/tarjeta-producto.component';
import { ServicioProductos } from '../../services/products/servicio-productos.service';
import { ServicioBanners } from '../../services/banners/servicio-banners.service';
import { ServicioInicio } from '../../services/home/servicio-inicio.service';
import { ServicioPin } from '../../services/pin/servicio-pin.service';

@Component({
  selector: 'app-pagina-inicio',
  standalone: true,
  host: { 'class': 'ion-page' },
  imports: [
    CommonModule,
    RouterModule,
    IonicModule,
    EncabezadoComponent,
    PiePaginaComponent,
    TarjetaProductoComponent
  ],
  templateUrl: './pagina-inicio.component.html',
  styleUrls: ['./pagina-inicio.component.css']
})
export class PaginaInicioComponent {
  public servicioProductos = inject(ServicioProductos);
  public servicioBanners = inject(ServicioBanners);
  public servicioInicio = inject(ServicioInicio);
  public servicioPin = inject(ServicioPin);

  public filtroTab = signal<'TODOS' | 'PUBLICOS' | 'PRIVADOS'>('TODOS');

  public productosVisibles = computed(() => {
    const estaDesbloqueado = this.servicioPin.estaDesbloqueado();
    const todos = this.servicioProductos.productos().filter(p => p.estado === 'ACTIVE');
    const tab = this.filtroTab();

    if (!estaDesbloqueado) {
      // Solo mostrar públicos si no está desbloqueado
      return todos.filter(p => p.visibilidad === 'PUBLIC');
    }

    if (tab === 'PUBLICOS') {
      return todos.filter(p => p.visibilidad === 'PUBLIC');
    } else if (tab === 'PRIVADOS') {
      return todos.filter(p => p.visibilidad === 'PRIVATE');
    }
    return todos;
  });

  public productosDestacados = computed(() => {
    return this.productosVisibles().filter(p => p.destacado);
  });

  abrirPinModal(): void {
    this.servicioPin.abrirModalPin();
  }
}
