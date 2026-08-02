import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { ServicioProductos } from '../../../services/products/servicio-productos.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { Categoria } from '../../../models/categoria.model';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-categorias.component.html',
  styleUrls: ['./pagina-admin-categorias.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminCategoriasComponent {
  public servicioProductos = inject(ServicioProductos);
  public servicioAuth = inject(ServicioAutenticacion);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  public mostrandoModal: boolean = false;
  public categoriaEdicion: Categoria | null = null;

  public nombre: string = '';
  public descripcion: string = '';
  public orden: number = 1;
  public activa: boolean = true;

  abrirCrear(): void {
    this.categoriaEdicion = null;
    this.nombre = '';
    this.descripcion = '';
    this.orden = this.servicioProductos.categorias().length + 1;
    this.activa = true;
    this.mostrandoModal = true;
  }

  abrirEditar(c: Categoria): void {
    this.categoriaEdicion = c;
    this.nombre = c.nombre;
    this.descripcion = c.descripcion || '';
    this.orden = c.orden;
    this.activa = c.activa;
    this.mostrandoModal = true;
  }

  cerrarModal(): void {
    this.mostrandoModal = false;
    this.categoriaEdicion = null;
  }

  async guardar(): Promise<void> {
    if (!this.nombre) return;

    if (this.categoriaEdicion) {
      await this.servicioProductos.actualizarCategoria(this.categoriaEdicion.id, {
        nombre: this.nombre,
        descripcion: this.descripcion,
        orden: this.orden,
        activa: this.activa
      });
    } else {
      await this.servicioProductos.crearCategoria({
        nombre: this.nombre,
        descripcion: this.descripcion,
        orden: this.orden,
        activa: this.activa
      });
    }

    this.cerrarModal();
  }

  async eliminar(id: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Categoría 🗑️',
      message: '¿Estás seguro de que deseas eliminar esta categoría? Los productos asociados podrían quedar sin categoría.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.servicioProductos.eliminarCategoria(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
