import { Pipe, PipeTransform } from '@angular/core';
import {Buyer} from "../../entities/Buyer";

@Pipe({
  name: 'BuyerPipe'
})
export class BuyerPipePipe implements PipeTransform {

  transform(value: number, buyers: Buyer[]): string | undefined {
    return buyers?.find(buyer => buyer.id == value)?.fio;
  }
}
