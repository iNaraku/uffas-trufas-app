import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioUsuariosCatalogo } from '../../../services/users/servicio-usuarios-catalogo.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { UsuarioCatalogo } from '../../../models/usuario-catalogo.model';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-usuarios.component.html',
  styleUrls: ['./pagina-admin-usuarios.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminUsuariosComponent {
  public servicioUsuarios = inject(ServicioUsuariosCatalogo);
  public servicioAuth = inject(ServicioAutenticacion);
  private router = inject(Router);

  public terminoBusqueda = signal<string>('');
  public mostrandoModal = signal<boolean>(false);
  public usuarioEdicion = signal<UsuarioCatalogo | null>(null);

  public nombreForm: string = '';
  public pinForm: string = '';
  public activoForm: boolean = true;
  public observacionesForm: string = '';

  public usuariosFiltrados = computed(() => {
    const q = this.terminoBusqueda().toLowerCase().trim();
    const lista = this.servicioUsuarios.listaUsuarios();

    if (!q) return lista;

    return lista.filter(u =>
      u.nombre.toLowerCase().includes(q) ||
      u.pin.includes(q) ||
      (u.observaciones || '').toLowerCase().includes(q)
    );
  });

  abrirCrear(): void {
    this.usuarioEdicion.set(null);
    this.nombreForm = '';
    this.pinForm = Math.floor(1000 + Math.random() * 9000).toString();
    this.activoForm = true;
    this.observacionesForm = '';
    this.mostrandoModal.set(true);
  }

  abrirEditar(u: UsuarioCatalogo): void {
    this.usuarioEdicion.set(u);
    this.nombreForm = u.nombre;
    this.pinForm = u.pin;
    this.activoForm = u.activo;
    this.observacionesForm = u.observaciones || '';
    this.mostrandoModal.set(true);
  }

  cerrarModal(): void {
    this.mostrandoModal.set(false);
    this.usuarioEdicion.set(null);
  }

  async guardar(): Promise<void> {
    if (!this.nombreForm || !this.pinForm) return;

    const edicion = this.usuarioEdicion();
    if (edicion) {
      await this.servicioUsuarios.actualizarUsuario(edicion.id, {
        nombre: this.nombreForm,
        pin: this.pinForm,
        activo: this.activoForm,
        observaciones: this.observacionesForm
      });
    } else {
      await this.servicioUsuarios.crearUsuario({
        nombre: this.nombreForm,
        pin: this.pinForm,
        activo: this.activoForm,
        observaciones: this.observacionesForm
      });
    }

    this.cerrarModal();
  }

  async cambiarEstado(id: string, actual: boolean): Promise<void> {
    await this.servicioUsuarios.cambiarEstado(id, !actual);
  }

  async eliminar(id: string): Promise<void> {
    if (confirm('¿Deseas eliminar este usuario de catálogo?')) {
      await this.servicioUsuarios.eliminarUsuario(id);
    }
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
