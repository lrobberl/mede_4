import {FermataShort} from './FermataShort';

export interface Disponibilita {
  id: string;
  data: Date;
  dataStr: string;
  fermata: FermataShort;
  verso: string;
  confermata: boolean;
}
