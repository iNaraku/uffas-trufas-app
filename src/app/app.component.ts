import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { ServicioTema } from './services/theme/servicio-tema.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private servicioTema = inject(ServicioTema);

  constructor() {
    // Inicializa el tema dinámico al arrancar la app
  }
}
