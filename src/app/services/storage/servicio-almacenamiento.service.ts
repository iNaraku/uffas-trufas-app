import { Injectable } from '@angular/core';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../config/firebase';

@Injectable({
  providedIn: 'root'
})
export class ServicioAlmacenamiento {
  public async subirImagen(archivo: File, carpeta: string = 'productos'): Promise<string> {
    try {
      const nombreUnico = `${Date.now()}_${archivo.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const referenciaStorage = ref(storage, `${carpeta}/${nombreUnico}`);
      const snapshot = await uploadBytes(referenciaStorage, archivo);
      const url = await getDownloadURL(snapshot.ref);
      return url;
    } catch (error) {
      console.warn('⚠️ Error al subir a Firebase Storage, usando DataURL local:', error);
    }

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


