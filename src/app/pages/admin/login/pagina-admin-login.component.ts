import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioAutenticacion } from '../../../services/auth/servicio-autenticacion.service';

@Component({
  selector: 'app-pagina-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule],
  templateUrl: './pagina-admin-login.component.html',
  styleUrls: ['./pagina-admin-login.component.css']
})
export class PaginaAdminLoginComponent {
  private servicioAuth = inject(ServicioAutenticacion);
  private router = inject(Router);

  public emailInput: string = 'admin@smokeshop.com';
  public passInput: string = 'admin123';
  public cargando: boolean = false;
  public mensajeError: string | null = null;

  async ingresar(): Promise<void> {
    this.mensajeError = null;
    if (!this.emailInput || !this.passInput) {
      this.mensajeError = 'Por favor completa todos los campos.';
      return;
    }

    this.cargando = true;
    const exito = await this.servicioAuth.iniciarSesion(this.emailInput, this.passInput);
    this.cargando = false;

    if (exito) {
      this.router.navigate(['/admin/dashboard']);
    } else {
      this.mensajeError = 'Credenciales inválidas. Verifica tu correo y contraseña.';
    }
  }
}
