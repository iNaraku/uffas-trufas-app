import { Component, inject } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { Router, NavigationStart } from '@angular/router';
import { addIcons } from 'ionicons';
import {
  mailOutline,
  lockClosedOutline,
  lockClosed,
  lockOpen,
  globeOutline,
  ribbonOutline,
  shieldCheckmarkOutline,
  paperPlaneOutline,
  alertCircleOutline,
  shieldCheckmark,
  logOutOutline,
  gridOutline,
  cubeOutline,
  peopleOutline,
  imagesOutline,
  pricetagsOutline,
  colorPaletteOutline,
  settingsOutline,
  imageOutline,
  createOutline,
  trashOutline,
  addCircle,
  addCircleOutline,
  openOutline,
  keyOutline,
  personAddOutline,
  searchOutline,
  cartOutline,
  lockOpenOutline,
  personOutline,
  logoWhatsapp,
  logoInstagram,
  logoFacebook,
  locationOutline,
  timeOutline,
  callOutline,
  copyOutline,
  checkmarkCircle,
  checkmarkCircleOutline,
  closeCircleOutline,
  eyeOutline,
  eyeOffOutline,
  arrowBackOutline,
  star,
  starOutline,
  funnelOutline,
  swapVerticalOutline,
  closeOutline,
  homeOutline,
  flame,
  flameOutline,
  sparklesOutline,
  refreshOutline,
  saveOutline,
  informationCircleOutline,
  checkmarkOutline,
  arrowForwardOutline,
  powerOutline
} from 'ionicons/icons';
import { ServicioTema } from './services/theme/servicio-tema.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  private servicioTema = inject(ServicioTema);
  private router = inject(Router);

  constructor() {
    // Evitar retención de foco ARIA al ocultar páginas en Ionic
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    });

    // Registrar iconos globales para Ionic 8 Standalone
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'lock-closed': lockClosed,
      'lock-open': lockOpen,
      'globe-outline': globeOutline,
      'ribbon-outline': ribbonOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline,
      'paper-plane-outline': paperPlaneOutline,
      'alert-circle-outline': alertCircleOutline,
      'shield-checkmark': shieldCheckmark,
      'log-out-outline': logOutOutline,
      'grid-outline': gridOutline,
      'cube-outline': cubeOutline,
      'people-outline': peopleOutline,
      'images-outline': imagesOutline,
      'pricetags-outline': pricetagsOutline,
      'color-palette-outline': colorPaletteOutline,
      'settings-outline': settingsOutline,
      'image-outline': imageOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'add-circle': addCircle,
      'add-circle-outline': addCircleOutline,
      'open-outline': openOutline,
      'key-outline': keyOutline,
      'person-add-outline': personAddOutline,
      'search-outline': searchOutline,
      'cart-outline': cartOutline,
      'lock-open-outline': lockOpenOutline,
      'person-outline': personOutline,
      'logo-whatsapp': logoWhatsapp,
      'logo-instagram': logoInstagram,
      'logo-facebook': logoFacebook,
      'location-outline': locationOutline,
      'time-outline': timeOutline,
      'call-outline': callOutline,
      'copy-outline': copyOutline,
      'checkmark-circle': checkmarkCircle,
      'checkmark-circle-outline': checkmarkCircleOutline,
      'close-circle-outline': closeCircleOutline,
      'eye-outline': eyeOutline,
      'eye-off-outline': eyeOffOutline,
      'arrow-back-outline': arrowBackOutline,
      'star': star,
      'star-outline': starOutline,
      'funnel-outline': funnelOutline,
      'swap-vertical-outline': swapVerticalOutline,
      'close-outline': closeOutline,
      'home-outline': homeOutline,
      'flame': flame,
      'flame-outline': flameOutline,
      'sparkles-outline': sparklesOutline,
      'refresh-outline': refreshOutline,
      'save-outline': saveOutline,
      'information-circle-outline': informationCircleOutline,
      'checkmark-outline': checkmarkOutline,
      'arrow-forward-outline': arrowForwardOutline,
      'power-outline': powerOutline
    });
  }
}



