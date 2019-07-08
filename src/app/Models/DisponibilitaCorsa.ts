import {Accompagnatore} from './Accompagnatore';
import {AccompagnatoriVerso} from './AccompagnatoriVerso';

export interface DisponibilitaCorsa {
  date: Date;
  linea: string;
  versi: AccompagnatoriVerso[];
  // todo: aggiungere la lista delle fermate?
  // Fermata[];
}
