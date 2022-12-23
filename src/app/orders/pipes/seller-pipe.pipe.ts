import {Pipe, PipeTransform} from '@angular/core';
import {Seller} from "../../entities/Seller";

@Pipe({
  name: 'sellerPipe'
})
export class SellerPipePipe implements PipeTransform {

  transform(value: number, sellers: Seller[]): string | undefined {
    return sellers?.find(seller => seller.id == value)?.fio;
  }
}
