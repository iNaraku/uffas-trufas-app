import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule, AlertController } from '@ionic/angular';
import { ServicioBanners } from '../../../services/banners/servicio-banners.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { Banner } from '../../../models/banner.model';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-banners',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-banners.component.html',
  styleUrls: ['./pagina-admin-banners.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminBannersComponent {
  public servicioBanners = inject(ServicioBanners);
  public servicioAuth = inject(ServicioAutenticacion);
  private alertCtrl = inject(AlertController);
  private router = inject(Router);

  public mostrandoModal: boolean = false;
  public bannerEdicion: Banner | null = null;

  public titulo: string = '';
  public subtitulo: string = '';
  public imagenUrl: string = '';
  public textoBoton: string = '';
  public orden: number = 1;
  public activo: boolean = true;
  public destacado: boolean = true;

  abrirCrear(): void {
    this.bannerEdicion = null;
    this.titulo = 'NUEVA PROMOCIÓN REBEL';
    this.subtitulo = 'Descripción de la promoción u oferta especial';
    this.imagenUrl = 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&w=1200&q=80';
    this.textoBoton = 'Ver Catálogo';
    this.orden = this.servicioBanners.banners().length + 1;
    this.activo = true;
    this.destacado = true;
    this.mostrandoModal = true;
  }

  abrirEditar(b: Banner): void {
    this.bannerEdicion = b;
    this.titulo = b.titulo;
    this.subtitulo = b.subtitulo;
    this.imagenUrl = b.imagenUrl;
    this.textoBoton = b.textoBoton || '';
    this.orden = b.orden;
    this.activo = b.activo;
    this.destacado = b.destacado;
    this.mostrandoModal = true;
  }

  cerrarModal(): void {
    this.mostrandoModal = false;
    this.bannerEdicion = null;
  }

  async guardar(): Promise<void> {
    if (!this.titulo || !this.imagenUrl) return;

    if (this.bannerEdicion) {
      await this.servicioBanners.actualizarBanner(this.bannerEdicion.id, {
        titulo: this.titulo,
        subtitulo: this.subtitulo,
        imagenUrl: this.imagenUrl,
        textoBoton: this.textoBoton,
        orden: this.orden,
        activo: this.activo,
        destacado: this.destacado
      });
    } else {
      await this.servicioBanners.crearBanner({
        titulo: this.titulo,
        subtitulo: this.subtitulo,
        imagenUrl: this.imagenUrl,
        textoBoton: this.textoBoton,
        orden: this.orden,
        activo: this.activo,
        destacado: this.destacado
      });
    }

    this.cerrarModal();
  }

  async eliminar(id: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar Banner 🖼️',
      message: '¿Estás seguro de que deseas eliminar este banner promocional del carrusel?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.servicioBanners.eliminarBanner(id);
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
