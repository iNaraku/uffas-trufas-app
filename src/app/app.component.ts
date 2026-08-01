import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart, RouterModule } from '@angular/router';
import { IonicModule, NavController, MenuController } from '@ionic/angular';
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
  closeCircle,
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
import { ServicioAutenticacion } from './services/auth/servicio-autenticacion.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, IonicModule],
})
export class AppComponent {
  public servicioTema = inject(ServicioTema);
  public servicioAuth = inject(ServicioAutenticacion);
  public router = inject(Router);
  private navCtrl = inject(NavController);
  private menuCtrl = inject(MenuController);

  constructor() {
    // Evitar retención de foco ARIA al ocultar páginas en Ionic
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (typeof document !== 'undefined' && document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    });

    // Registrar iconos globales para Ionic 8 Standalone
    addIcons({
      'mail-outline': mailOutline, mailOutline,
      'lock-closed-outline': lockClosedOutline, lockClosedOutline,
      'lock-closed': lockClosed, lockClosed,
      'lock-open': lockOpen, lockOpen,
      'globe-outline': globeOutline, globeOutline,
      'ribbon-outline': ribbonOutline, ribbonOutline,
      'shield-checkmark-outline': shieldCheckmarkOutline, shieldCheckmarkOutline,
      'paper-plane-outline': paperPlaneOutline, paperPlaneOutline,
      'alert-circle-outline': alertCircleOutline, alertCircleOutline,
      'shield-checkmark': shieldCheckmark, shieldCheckmark,
      'log-out-outline': logOutOutline, logOutOutline,
      'grid-outline': gridOutline, gridOutline,
      'cube-outline': cubeOutline, cubeOutline,
      'people-outline': peopleOutline, peopleOutline,
      'images-outline': imagesOutline, imagesOutline,
      'pricetags-outline': pricetagsOutline, pricetagsOutline,
      'color-palette-outline': colorPaletteOutline, colorPaletteOutline,
      'settings-outline': settingsOutline, settingsOutline,
      'image-outline': imageOutline, imageOutline,
      'create-outline': createOutline, createOutline,
      'trash-outline': trashOutline, trashOutline,
      'add-circle': addCircle, addCircle,
      'add-circle-outline': addCircleOutline, addCircleOutline,
      'open-outline': openOutline, openOutline,
      'key-outline': keyOutline, keyOutline,
      'person-add-outline': personAddOutline, personAddOutline,
      'search-outline': searchOutline, searchOutline,
      'cart-outline': cartOutline, cartOutline,
      'lock-open-outline': lockOpenOutline, lockOpenOutline,
      'person-outline': personOutline, personOutline,
      'logo-whatsapp': logoWhatsapp, logoWhatsapp,
      'logo-instagram': logoInstagram, logoInstagram,
      'logo-facebook': logoFacebook, logoFacebook,
      'location-outline': locationOutline, locationOutline,
      'time-outline': timeOutline, timeOutline,
      'call-outline': callOutline, callOutline,
      'copy-outline': copyOutline, copyOutline,
      'checkmark-circle': checkmarkCircle, checkmarkCircle,
      'checkmark-circle-outline': checkmarkCircleOutline, checkmarkCircleOutline,
      'close-circle': closeCircle, closeCircle,
      'close-circle-outline': closeCircleOutline, closeCircleOutline,
      'eye-outline': eyeOutline, eyeOutline,
      'eye-off-outline': eyeOffOutline, eyeOffOutline,
      'arrow-back-outline': arrowBackOutline, arrowBackOutline,
      'star': star,
      'star-outline': starOutline, starOutline,
      'funnel-outline': funnelOutline, funnelOutline,
      'swap-vertical-outline': swapVerticalOutline, swapVerticalOutline,
      'close-outline': closeOutline, closeOutline,
      'home-outline': homeOutline, homeOutline,
      'flame': flame,
      'flame-outline': flameOutline, flameOutline,
      'sparkles-outline': sparklesOutline, sparklesOutline,
      'refresh-outline': refreshOutline, refreshOutline,
      'save-outline': saveOutline, saveOutline,
      'information-circle-outline': informationCircleOutline, informationCircleOutline,
      'checkmark-outline': checkmarkOutline, checkmarkOutline,
      'arrow-forward-outline': arrowForwardOutline, arrowForwardOutline,
      'power-outline': powerOutline, powerOutline
    });
  }

  esRutaAdmin(): boolean {
    return this.router.url.includes('/admin') && !this.router.url.includes('/admin/login');
  }

  irAAdmin(ruta: string): void {
    this.menuCtrl.close('admin-menu');
    this.navCtrl.navigateRoot(ruta, { animated: false });
  }

  async salirAdmin(): Promise<void> {
    this.menuCtrl.close('admin-menu');
    await this.servicioAuth.cerrarSesion();
    this.navCtrl.navigateRoot('/admin/login', { animated: false });
  }
}



