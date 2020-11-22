import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: string[], term: string): unknown {
    return value.filter(x => x.includes(term));
  }

}
