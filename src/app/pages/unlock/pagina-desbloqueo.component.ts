import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { EncabezadoComponent } from '../../shared/components/encabezado/encabezado.component';
import { PiePaginaComponent } from '../../shared/components/pie-pagina/pie-pagina.component';
import { ServicioPin } from '../../services/pin/servicio-pin.service';

@Component({
  selector: 'app-pagina-desbloqueo',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, IonicModule, EncabezadoComponent, PiePaginaComponent],
  templateUrl: './pagina-desbloqueo.component.html',
  styleUrls: ['./pagina-desbloqueo.component.css']
})
export class PaginaDesbloqueoComponent {
  public servicioPin = inject(ServicioPin);
  private router = inject(Router);

  public pinIngresado: string = '';
  public cargando: boolean = false;

  async validarPin(): Promise<void> {
    if (!this.pinIngresado) return;
    this.cargando = true;
    const exito = await this.servicioPin.validarPin(this.pinIngresado);
    this.cargando = false;

    if (exito) {
      this.router.navigate(['/catalog']);
    }
  }
}
