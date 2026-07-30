import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EncabezadoComponent } from '../../shared/components/encabezado/encabezado.component';
import { PiePaginaComponent } from '../../shared/components/pie-pagina/pie-pagina.component';
import { TarjetaProductoComponent } from '../../shared/components/tarjeta-producto/tarjeta-producto.component';
import { ModalPinComponent } from '../../shared/components/modal-pin/modal-pin.component';
import { ServicioProductos } from '../../services/products/servicio-productos.service';
import { ServicioPin } from '../../services/pin/servicio-pin.service';
import { Producto } from '../../core/models/producto.model';

@Component({
  selector: 'app-pagina-catalogo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonicModule,
    EncabezadoComponent,
    PiePaginaComponent,
    TarjetaProductoComponent,
    ModalPinComponent
  ],
  templateUrl: './pagina-catalogo.component.html',
  styleUrls: ['./pagina-catalogo.component.css']
})
export class PaginaCatalogoComponent {
  public servicioProductos = inject(ServicioProductos);
  public servicioPin = inject(ServicioPin);

  public terminoBusqueda = signal<string>('');
  public categoriaSeleccionada = signal<string>('TODAS');
  public filtroVisibilidad = signal<'TODOS' | 'PUBLICOS' | 'PRIVADOS'>('TODOS');
  public mostrarModalPin = false;

  public productosFiltrados = computed(() => {
    const todos = this.servicioProductos.productos().filter(p => p.estado === 'ACTIVE');
    const estaDesbloqueado = this.servicioPin.estaDesbloqueado();
    const busqueda = this.terminoBusqueda().toLowerCase().trim();
    const catId = this.categoriaSeleccionada();
    const vis = this.filtroVisibilidad();

    return todos.filter(prod => {
      // Filtro visibilidad PIN
      if (!estaDesbloqueado && prod.visibilidad === 'PRIVATE') {
        return false;
      }
      if (vis === 'PUBLICOS' && prod.visibilidad !== 'PUBLIC') return false;
      if (vis === 'PRIVADOS' && prod.visibilidad !== 'PRIVATE') return false;

      // Filtro Categoría
      if (catId !== 'TODAS' && prod.categoriaId !== catId) return false;

      // Filtro Búsqueda
      if (busqueda.length > 0) {
        const enNombre = prod.nombre.toLowerCase().includes(busqueda);
        const enDesc = prod.descripcion.toLowerCase().includes(busqueda);
        const enCat = (prod.categoriaNombre || '').toLowerCase().includes(busqueda);
        if (!enNombre && !enDesc && !enCat) return false;
      }

      return true;
    }).sort((a, b) => a.orden - b.orden);
  });

  abrirPinModal(): void {
    this.mostrarModalPin = true;
  }

  cerrarPinModal(): void {
    this.mostrarModalPin = false;
  }
}
