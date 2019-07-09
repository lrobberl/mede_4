import {Accompagnatore} from './Accompagnatore';
import {AccompagnatoriVerso} from './AccompagnatoriVerso';

export interface DisponibilitaCorsa {
  date: Date;
  linea: string;
  accompagnatoriAndata: Array<string>;
  accompagnatoriRitorno: Array<string>;
}
