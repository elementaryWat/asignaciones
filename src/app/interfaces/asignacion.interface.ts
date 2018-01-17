import {Hermano} from './hermano.interface';
export interface Asignacion{
  tema:string;
  semana:string;
  asignado:Hermano;
  duracion?:number;
  ayudante?:Hermano;
  titulo?:string;
  leccion?:string;
  observaciones?:string;
  sala?:number;
}
