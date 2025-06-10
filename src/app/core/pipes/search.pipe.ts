import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform<T>(items: T[], searchText: string, keys: (keyof T)[]): T[] {

    if (!searchText || !items) return items;

    const lowerSearch = searchText.toLowerCase();

    return items.filter(item =>
      keys.some(key => {
        const value = item[key];
        return value?.toString().toLowerCase().includes(lowerSearch);
      })
    );

  }

}
