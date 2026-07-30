import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlmacenamiento {
  public async subirImagen(archivo: File, carpeta: string = 'productos'): Promise<string> {
    return new Promise((resolve, reject) => {
      const lector = new FileReader();
      lector.onload = () => {
        if (lector.result) {
          resolve(lector.result.toString());
        } else {
          reject('No se pudo procesar la imagen.');
        }
      };
      lector.onerror = error => reject(error);
      lector.readAsDataURL(archivo);
    });
  }
}
