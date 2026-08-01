import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioTema } from '../../../services/theme/servicio-tema.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { TemaConfiguracion } from '../../../models/tema.model';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-tema',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-tema.component.html',
  styleUrls: ['./pagina-admin-tema.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminTemaComponent {
  public servicioTema = inject(ServicioTema);
  public servicioAuth = inject(ServicioAutenticacion);
  private router = inject(Router);

  public formTema: TemaConfiguracion = { ...this.servicioTema.temaActual() };
  public guardadoExitoso: boolean = false;

  actualizarColorEnVivo(): void {
    this.servicioTema.aplicarEstilosCss(this.formTema);
  }

  guardarTema(): void {
    this.servicioTema.actualizarTema(this.formTema);
    this.guardadoExitoso = true;
    setTimeout(() => this.guardadoExitoso = false, 3000);
  }

  restaurar(): void {
    this.servicioTema.restaurarTemaPorDefecto();
    this.formTema = { ...this.servicioTema.temaActual() };
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
