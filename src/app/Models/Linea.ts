import {Fermata} from './Fermata';

export interface Linea {
  id: string;
  nome: string;
  aaccompagnatori: string[];
  fermate: Fermata[];
}
