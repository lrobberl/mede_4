import {Bambino} from './Bambino';

export interface Fermata {
  id: string;
  nome: string;
  orario: string;
  bambini: Bambino[];
}
