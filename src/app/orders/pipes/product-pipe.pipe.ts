import {Pipe, PipeTransform} from '@angular/core';
import {Product} from "../../entities/Product";

@Pipe({
  name: 'productPipe'
})
export class ProductPipePipe implements PipeTransform {

  transform(value: number, products: Product[]): string | undefined {
    return products?.find(product => product.id == value)?.productname;
  }
}
