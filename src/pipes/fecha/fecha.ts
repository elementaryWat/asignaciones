import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

/**
 * Generated class for the FechaPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'fecha',
})
export class FechaPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(desde: string, hasta:string ) {
    return `${moment(desde).format("DD/MM/YYYY")} al ${moment(hasta).format("DD/MM/YYYY")}`;
  }
}
