import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { ServicioConfiguracion } from '../../../services/settings/servicio-configuracion.service';

@Component({
  selector: 'app-pie-pagina',
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
  templateUrl: './pie-pagina.component.html',
  styleUrls: ['./pie-pagina.component.css']
})
export class PiePaginaComponent {
  public servicioConfig = inject(ServicioConfiguracion);
  public anioActual = new Date().getFullYear();
}
