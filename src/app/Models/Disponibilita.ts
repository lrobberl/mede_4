import {FermataShort} from './FermataShort';

export interface Disponibilita {
  id: string;
  data: Date;
  fermata: FermataShort;
  verso: string;
}
