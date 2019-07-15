import {FermataShort} from './FermataShort';

export interface Prenotazione {
  id: string;
  data: Date;
  fermata: FermataShort;
  verso: string;
  corsaIndex: number;
}
