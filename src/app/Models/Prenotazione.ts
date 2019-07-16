import {FermataShort} from './FermataShort';

export interface Prenotazione {
  id: string;
  bambino: string;
  data: Date;
  fermata: FermataShort;
  verso: string;
}
