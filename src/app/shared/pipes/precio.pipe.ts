import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'precio',
  standalone: true
})
export class PrecioPipe implements PipeTransform {
  transform(valor: number | null | undefined): string {
    if (valor === null || valor === undefined || isNaN(valor)) {
      return '$0.00 MXN';
    }
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(valor);
  }
}
