import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioConfiguracion } from '../../../services/settings/servicio-configuracion.service';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';
import { ConfiguracionSitio } from '../../../models/configuracion.model';

import { EncabezadoAdminComponent } from '../../../shared/components/encabezado-admin/encabezado-admin.component';

@Component({
  selector: 'app-pagina-admin-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoAdminComponent],
  templateUrl: './pagina-admin-configuracion.component.html',
  styleUrls: ['./pagina-admin-configuracion.component.css'],
  host: { 'class': 'ion-page' }
})
export class PaginaAdminConfiguracionComponent {
  public servicioConfig = inject(ServicioConfiguracion);
  public servicioAuth = inject(ServicioAutenticacion);
  private router = inject(Router);

  public formConfig: ConfiguracionSitio = { ...this.servicioConfig.configuracion() };
  public guardadoExitoso: boolean = false;

  guardar(): void {
    this.servicioConfig.actualizarConfiguracion(this.formConfig);
    this.guardadoExitoso = true;
    setTimeout(() => this.guardadoExitoso = false, 3000);
  }

  async salirAdmin(): Promise<void> {
    await this.servicioAuth.cerrarSesion();
    this.router.navigate(['/admin/login']);
  }
}
