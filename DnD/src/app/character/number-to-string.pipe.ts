import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'numberToString'
})
export class NumberToStringPipe implements PipeTransform {

  transform(value: number): string {
    return value > 0 ? '+' + value : String(value);
  }

}
