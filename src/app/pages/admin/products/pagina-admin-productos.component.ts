import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioProductos } from '../../../services/products/servicio-productos.service';
import { ServicioAlmacenamiento } from '../../../services/storage/servicio-almacenamiento.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { Producto, VisibilidadProducto, EstadoProducto } from '../../../models/producto.model';
import { PrecioPipe } from '../../../shared/pipes/precio.pipe';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-productos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    IonicModule,
    PrecioPipe,
    EncabezadoAdminComponent
  ],
  templateUrl: './pagina-admin-productos.component.html',
  styleUrls: ['./pagina-admin-productos.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminProductosComponent {
  public servicioProductos = inject(ServicioProductos);
  public servicioStorage = inject(ServicioAlmacenamiento);
  public servicioAuth = inject(ServicioAutenticacion);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  public mostrandoFormulario = signal<boolean>(false);
  public productoEdicion = signal<Producto | null>(null);
  public busquedaAdmin = signal<string>('');

  public productoForm: FormGroup = this.fb.group({
    nombre: ['', [Validators.required]],
    descripcion: ['', [Validators.required]],
    categoriaId: ['', [Validators.required]],
    precio: [0, [Validators.required, Validators.min(0)]],
    imagenUrl: ['', [Validators.required]],
    disponible: [true],
    destacado: [false],
    orden: [1],
    visibilidad: ['PUBLIC' as VisibilidadProducto, [Validators.required]],
    estado: ['ACTIVE' as EstadoProducto, [Validators.required]]
  });

  abrirFormularioCrear(): void {
    this.productoEdicion.set(null);
    this.productoForm.reset({
      nombre: '',
      descripcion: '',
      categoriaId: this.servicioProductos.categorias()[0]?.id || '',
      precio: 100,
      imagenUrl: 'https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=600&q=80',
      disponible: true,
      destacado: false,
      orden: this.servicioProductos.productos().length + 1,
      visibilidad: 'PUBLIC',
      estado: 'ACTIVE'
    });
    this.mostrandoFormulario.set(true);
  }

  abrirFormularioEditar(prod: Producto): void {
    this.productoEdicion.set(prod);
    this.productoForm.patchValue({
      nombre: prod.nombre,
      descripcion: prod.descripcion,
      categoriaId: prod.categoriaId,
      precio: prod.precio,
      imagenUrl: prod.imagenUrl,
      disponible: prod.disponible,
      destacado: prod.destacado,
      orden: prod.orden,
      visibilidad: prod.visibilidad,
      estado: prod.estado
    });
    this.mostrandoFormulario.set(true);
  }

  cancelarFormulario(): void {
    this.mostrandoFormulario.set(false);
    this.productoEdicion.set(null);
  }

  async guardarProducto(): Promise<void> {
    if (this.productoForm.invalid) {
      this.productoForm.markAllAsTouched();
      return;
    }

    const val = this.productoForm.value;
    const edicion = this.productoEdicion();

    if (edicion) {
      await this.servicioProductos.actualizarProducto(edicion.id, val);
    } else {
      await this.servicioProductos.crearProducto(val);
    }

    this.cancelarFormulario();
  }

  async duplicar(id: string): Promise<void> {
    await this.servicioProductos.duplicarProducto(id);
  }

  async eliminar(id: string): Promise<void> {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      await this.servicioProductos.eliminarProducto(id);
    }
  }

  async cambiarVisibilidad(id: string, vis: VisibilidadProducto): Promise<void> {
    const nueva = vis === 'PUBLIC' ? 'PRIVATE' : 'PUBLIC';
    await this.servicioProductos.cambiarVisibilidad(id, nueva);
  }

  async cambiarEstado(id: string, est: EstadoProducto): Promise<void> {
    const nuevo = est === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    await this.servicioProductos.cambiarEstado(id, nuevo);
  }

  async subirImagenLocal(e: Event): Promise<void> {
    const input = e.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const url = await this.servicioStorage.subirImagen(input.files[0], 'productos');
      this.productoForm.patchValue({ imagenUrl: url });
    }
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
